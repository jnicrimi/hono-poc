---
paths:
  - "apps/api/**"
---

# apps/api 規約

## モジュール構成

`src/modules/<name>/` に機能単位で配置し、以下のレイヤーに分割する。

- `domain/`
  - エンティティ
  - 値オブジェクト
  - リポジトリインターフェース
  - ドメインエラー
- `application/`
  - ユースケース
- `infrastructure/`
  - Drizzle 実装（`drizzle-*-repository.ts` / `drizzle-*-reader.ts`）
  - `schema.ts`
- `presentation/`
  - @hono/zod-openapi ルーター
  - エンドポイント別 zod スキーマ
- `contract/`
  - 他モジュールへ公開するインターフェースとその実装
- `test-support/`
  - スタブ
  - ビルダー
  - テスト用アプリファクトリ

## モジュール追加

1. `shared/di/register-<name>-module.ts` を作成する
2. `container.ts` から呼び出す
3. presentation の router が export する `<name>ApiTag` を `container.ts` の `openApiDocConfig` に追加する

## 依存境界

- 境界ルールは `.dependency-cruiser.json` に日本語コメント付きで定義されている
- `mise run depcruise` で検証する

## 命名規則

- ファイル名は主要な export 名に対応する kebab-case とする

### ユースケース

- 動詞 + エンティティ名で命名する
- 動詞は以下を使用する
  - create
  - list
  - show
  - update
  - delete
- 動詞に get は使わない（取得は show / list を使う）
- 入力型は更新系が `<ユースケース名>Command`、参照系が `<ユースケース名>Query` とする
- 出力型は `<ユースケース名>Result` とする

### ドメイン

- エンティティのファクトリは `create()` / `reconstruct()` とする
- 値オブジェクトのファクトリは `from()`、ID は `generate()` / `restore()` とする
- ドメインエラーは `<エンティティ名><状態>Error` とする

### リポジトリ・reader

- リポジトリは `<エンティティ名>Repository`、reader は `<エンティティ名>Reader` とする
- インターフェースの実装クラスは `Drizzle<インターフェース名>` のように技術名を接頭辞にする
- 取得メソッドは find で始める（`findById` / `findMany`）
- 更新メソッドは `insert` / `update` / `delete` とする

## 実装パターン

- 値オブジェクトはプリミティブ値を検証付きでラップし、`.value` で公開する
- エンティティはコンストラクタを private にし、静的ファクトリで生成する
- presentation の ID 検証には素の `z.uuid()` ではなく `shared/openapi` の UUID スキーマヘルパーを使う
- 文字数・件数の上限は domain に定数で定義し、presentation の zod と infrastructure の Drizzle schema はそれを import する
- 入力検証は presentation の zod と domain の値オブジェクトの両方で行う
- 更新系と参照系を分離する
  - `*-repository` — エンティティの永続化（登録・更新・削除）と、そのためのエンティティ取得を担う
  - `*-reader` — 参照系ユースケース向けに ReadModel を返す
- create / update のユースケースは書き込み後に reader で取得し直し、その ReadModel を返す
- 複数テーブルにまたがる集約の永続化には Unit of Work を使う
- 楽観ロックは `version` カラムを条件に更新し、更新件数が 0 件なら `OptimisticLockError` を投げる

## エラー処理

- エラーは `AppError` のサブクラスで表現し、`ErrorCategory` に応じて HTTP ステータスへ変換する
- エラーメッセージは日本語で書く
- 定型文は用途別に `shared/error` へ集約する
  - `entity-messages.ts` — エンティティ操作
  - `validation-messages.ts` — 入力検証
  - `http-messages.ts` — HTTP 層
- 表示名は各モジュールの domain に集約する
  - `*-entity-label.ts` — エンティティ表示名
  - `*-field-labels.ts` — フィールド表示名

## ログ

- ログは shared の HTTP 境界でのみ出す
- `AppError` はログせず、未処理例外（5xx）のみ error ログを出す

## HTTP

- メソッドとステータスは以下で統一する
  - 作成 — POST 201
  - 取得・一覧 — GET 200
  - 更新 — PATCH 200
  - 削除 — DELETE 204
- パスは複数形のリソース名でマウントする

## ページネーション

- 一覧のクエリは `shared/pagination` で生成した page / perPage で受ける
- ユースケースは `shared/pagination` のヘルパーで limit / offset へ変換し、メタ情報を組み立てる

## OpenAPI

- OpenAPI スペックは presentation の zod スキーマから生成し、`openapi.json` としてコミットする
- `operationId` はユースケース名と揃えた camelCase とする
- タグ名は英語の複数形とする
- `summary` と `description` は日本語で書く
- route の `responses` に宣言する検証エラーのステータスは `shared/openapi` の defaultHook の変換規則に合わせる

## API クライアントの再生成

- presentation の zod スキーマを変更したら OpenAPI スペックと web の API クライアントを再生成する

### 再生成の手順

1. `mise run api-client:generate` を実行する

## DB・マイグレーション

- スキーマは各モジュールの `infrastructure/schema.ts` に定義する
- マイグレーションの実行（`mise run db:migrate`）は事前にユーザーの承認を得る
- マイグレーション名は変更内容を表す snake_case の英語で指定する

### スキーマの変更手順

1. `schema.ts` を編集する
2. `mise run db:generate` でマイグレーションを生成する
3. `mise run db:check` で整合性を検証する
4. ユーザーの承認を得て `mise run db:migrate` で適用する
5. `mise run db-docs:generate` で DB ドキュメントを再生成する

## テスト

### テストの種類

- `*.unit.test.ts`
  - domain / application をスタブでテストする
- `*.integration.test.ts`
  - `shared/db/test-support` のヘルパーでテストごとにトランザクションをロールバックする
- `*.api.test.ts`
  - `create-<name>-test-app.ts` で構築したアプリへ `app.request()` でリクエストする

### テストの書き方

- テストは実装ファイルと同じディレクトリに配置する
- `test-support/` のスタブ・ビルダーを再利用する
- describe には対象を書く
- タイトルには日本語の常体で操作と期待する結果を書く
