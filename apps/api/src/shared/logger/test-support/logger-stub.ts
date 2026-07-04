import { vi } from "vitest"
import type { AppLogger } from "../logger"

export const createLoggerStub = (): AppLogger => {
  const stub = {
    fatal: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
    silent: vi.fn(),
    child: vi.fn(),
  }
  stub.child.mockReturnValue(stub as unknown as AppLogger)
  return stub as unknown as AppLogger
}
