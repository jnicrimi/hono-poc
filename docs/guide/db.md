# DB

## コマンド

### 起動

```sh
mise run db:up
```

### 停止

```sh
mise run db:down
```

### ログの確認

```sh
mise run db:logs
```

### psql での接続

```sh
mise run db:psql
```

## マイグレーション

スキーマ定義(`apps/api/src/modules/*/infrastructure/schema.ts`)を変更した場合は、マイグレーションを生成・適用し、テーブル定義書を更新する。

### 生成

スキーマ定義を編集した後、マイグレーションファイルを生成する。

```sh
mise run db:generate
```

`apps/api/drizzle/` に SQL と `meta/` スナップショットが生成されるので、内容を確認する。

### 適用

```sh
mise run db:migrate
```

### 整合性の検証

```sh
mise run db:check
```

### コミット対象

- `apps/api/drizzle/`(SQL と `meta/` スナップショット)

## テーブル定義書

スキーマ定義を変更した場合は、テーブル定義書もあわせて更新する。

### コメントの追記

テーブルやカラムを追加した場合は、`.tbls.yml` の `comments:` にコメントを追記する。

### 検証

```sh
mise run db-docs:lint
```

### 更新

```sh
mise run db-docs:generate
```

### コミット対象

- `.tbls.yml`
- `docs/db/`

## ER 図の生成

`docs/public/erd` に ER 図を生成する。

```sh
mise run liam:build
```

## シーダー

シードデータを登録する。

::: warning 注意
既存データはすべて削除される。
:::

### 実行

```sh
mise run db:seed
```
