---
paths:
  - "apps/web/e2e/**"
---

# apps/web/e2e 規約

## 実行

- 実行には Postgres の起動が必要
- api / web の開発サーバは Playwright の webServer 設定で自動起動する

## スペック規約

- スペックは `e2e/*.spec.ts` に置く
- describe には対象を書く
- タイトルには日本語の常体で操作と期待する結果を書く
- 要素の特定はロールベースロケーター（`getByRole`）を優先する
- テストデータの準備・削除は `e2e/support/api.ts` の API フィクスチャで行う
