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
- Pino
- Vitest

### apps/web

- React
- Vite
- TanStack Router / TanStack Query
- Tailwind CSS
- shadcn/ui（Base UI）
- orval
- MSW
- Playwright
- Storybook

## モノレポ構成

### apps/api

- REST API
- モジュール別 DDD レイヤー構成
- 規約は `.claude/rules/backend/api.md` を参照
- DB・マイグレーションの規約は `.claude/rules/backend/drizzle.md` を参照

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

## 開発手順書

- セットアップ・環境変数・DB・テストなどの手順は `docs/guide/` を参照する
