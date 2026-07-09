import type { ServerType } from "@hono/node-server"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { AppLogger } from "../logger/logger"
import { registerGracefulShutdown } from "./register-graceful-shutdown"

type CloseCb = (err?: Error) => void

const makeServer = (options?: { withCloseIdle?: boolean }) => {
  let closeCb: CloseCb | undefined
  const closeIdleConnections = vi.fn()
  const close = vi.fn((cb: CloseCb) => {
    closeCb = cb
  })
  const server = {
    close,
    ...(options?.withCloseIdle === false ? {} : { closeIdleConnections }),
  } as unknown as ServerType
  return {
    server,
    close,
    closeIdleConnections,
    triggerClose: (err?: Error) => closeCb?.(err),
  }
}

const makeDb = () => {
  const end = vi.fn().mockResolvedValue(undefined)
  return { db: { $client: { end } }, end }
}

const makeLogger = () => {
  const logger = { info: vi.fn(), error: vi.fn() }
  return { logger: logger as unknown as AppLogger, ...logger }
}

const makeProcessRef = () => {
  const handlers: Partial<Record<NodeJS.Signals, () => void>> = {}
  const processRef = {
    on: (signal: NodeJS.Signals, listener: () => void) => {
      handlers[signal] = listener
    },
  }
  return { processRef, handlers }
}

describe("registerGracefulShutdown", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("正常終了時は DB プールを閉じて onExit(0) を呼ぶ", async () => {
    const onExit = vi.fn()
    const { server, close, closeIdleConnections, triggerClose } = makeServer()
    const { db, end } = makeDb()
    const { logger } = makeLogger()
    const { processRef, handlers } = makeProcessRef()
    registerGracefulShutdown({
      server,
      db,
      logger,
      timeoutMs: 10_000,
      onExit,
      processRef,
    })

    handlers.SIGTERM?.()
    expect(close).toHaveBeenCalledOnce()
    expect(closeIdleConnections).toHaveBeenCalledOnce()

    await triggerClose(undefined)
    expect(end).toHaveBeenCalledOnce()
    expect(onExit).toHaveBeenCalledWith(0)
  })

  it("server.close が失敗しても DB プールを閉じて onExit(1) を呼ぶ", async () => {
    const onExit = vi.fn()
    const { server, triggerClose } = makeServer()
    const { db, end } = makeDb()
    const { logger, error } = makeLogger()
    const { processRef, handlers } = makeProcessRef()
    registerGracefulShutdown({
      server,
      db,
      logger,
      timeoutMs: 10_000,
      onExit,
      processRef,
    })

    handlers.SIGINT?.()
    await triggerClose(new Error("close failed"))
    expect(end).toHaveBeenCalledOnce()
    expect(error).toHaveBeenCalled()
    expect(onExit).toHaveBeenCalledWith(1)
  })

  it("タイムアウト時は強制的に onExit(1) を呼ぶ", () => {
    vi.useFakeTimers()
    const onExit = vi.fn()
    const { server } = makeServer()
    const { db, end } = makeDb()
    const { logger, error } = makeLogger()
    const { processRef, handlers } = makeProcessRef()
    registerGracefulShutdown({
      server,
      db,
      logger,
      timeoutMs: 10_000,
      onExit,
      processRef,
    })

    handlers.SIGTERM?.()
    expect(onExit).not.toHaveBeenCalled()

    vi.advanceTimersByTime(10_000)
    expect(onExit).toHaveBeenCalledWith(1)
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({ timeoutMs: 10_000 }),
      expect.any(String),
    )
    expect(end).not.toHaveBeenCalled()
  })

  it("closeIdleConnections が無くても例外を投げない", async () => {
    const onExit = vi.fn()
    const { server, triggerClose } = makeServer({ withCloseIdle: false })
    const { db } = makeDb()
    const { logger } = makeLogger()
    const { processRef, handlers } = makeProcessRef()
    registerGracefulShutdown({
      server,
      db,
      logger,
      timeoutMs: 10_000,
      onExit,
      processRef,
    })

    expect(() => handlers.SIGTERM?.()).not.toThrow()
    await triggerClose(undefined)
    expect(onExit).toHaveBeenCalledWith(0)
  })

  it("複数シグナルでも shutdown は一度だけ実行する", async () => {
    const onExit = vi.fn()
    const { server, close, closeIdleConnections, triggerClose } = makeServer()
    const { db } = makeDb()
    const { logger } = makeLogger()
    const { processRef, handlers } = makeProcessRef()
    registerGracefulShutdown({
      server,
      db,
      logger,
      timeoutMs: 10_000,
      onExit,
      processRef,
    })

    handlers.SIGINT?.()
    handlers.SIGTERM?.()
    expect(close).toHaveBeenCalledOnce()
    expect(closeIdleConnections).toHaveBeenCalledOnce()

    await triggerClose(undefined)
    expect(onExit).toHaveBeenCalledWith(0)
  })
})
