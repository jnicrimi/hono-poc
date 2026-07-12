---
paths:
  - "apps/api/src/modules/*/infrastructure/schema.ts"
  - "apps/api/drizzle/**"
  - "apps/api/drizzle.config.ts"
  - ".tbls.yml"
---

# Drizzle 規約

## スキーマ

- スキーマは各モジュールの `infrastructure/schema.ts` に定義する
- テーブル・カラムのコメントは `.tbls.yml` の `comments` に日本語で定義する

## マイグレーション

- マイグレーションの実行（`mise run db:migrate`）は事前にユーザーの承認を得る
- マイグレーション名は変更内容を表す snake_case の英語で指定する

### スキーマの変更手順

1. `schema.ts` を編集する
2. `.tbls.yml` の `comments` にテーブル・カラムのコメントを定義する
3. `mise run db:generate` でマイグレーションを生成する
4. `mise run db:check` で整合性を検証する
5. ユーザーの承認を得て `mise run db:migrate` で適用する
6. `mise run db-docs:generate` で DB ドキュメントを再生成する
7. `mise run db-docs:lint` でコメントの規約を検証する

## リントツール

- Drizzle Kit — `mise run db:check`（スキーマとマイグレーションの整合性検証）
- tbls — `mise run db-docs:lint`（テーブル・カラムコメントの必須チェック）
- drift CI — `.github/workflows/drift.yml` がマイグレーションの生成漏れを検出する
