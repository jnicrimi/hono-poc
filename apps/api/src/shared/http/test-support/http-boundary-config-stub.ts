import type { HttpBoundaryConfig } from "../register-http-boundary"

export const createHttpBoundaryConfigStub = (
  overrides: Partial<HttpBoundaryConfig> = {},
): HttpBoundaryConfig => ({
  bodyLimitBytes: 1_048_576,
  requestTimeoutMs: 30_000,
  ...overrides,
})
