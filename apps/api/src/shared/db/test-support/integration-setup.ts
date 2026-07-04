import { afterAll } from "vitest"
import { closeTestDb } from "./test-db"

afterAll(async () => {
  await closeTestDb()
})
