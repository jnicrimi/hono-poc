# hono-poc

## 技術スタック

### ランタイム

- Node.js
- pnpm

### モノレポ

- pnpm workspace
- Turborepo

### apps/api

- Hono
- @hono/zod-openapi
- Drizzle ORM
- PostgreSQL
- pino
- Vitest

### apps/web

- React
- Vite
- TanStack Router / TanStack Query
- Tailwind CSS
- shadcn（@base-ui）
- orval
- MSW
- Playwright
- Storybook

### 品質ツール

- Biome
- dependency-cruiser
- knip
- lefthook

## モノレポ構成

### apps/api

- REST API
- モジュール別 DDD レイヤー構成
- 規約は `.claude/rules/backend/api.md` を参照

### apps/web

- SPA
- modules / shared / routes 構成
- 規約は `.claude/rules/frontend/web.md` を参照
- E2E テストの規約は `.claude/rules/frontend/e2e.md` を参照

### packages/typescript-config

- 共有 tsconfig プリセット

## 開発コマンド

- mise で管理している
- 一覧は `mise tasks` で確認する

## 品質チェック

- 実装完了後は以下を通す
  - `mise run lint`
  - `mise run typecheck`
  - `mise run knip`
  - `mise run depcruise`
- テストは変更したアプリの全体を実行する（`mise run test-api` / `mise run test-web`）
