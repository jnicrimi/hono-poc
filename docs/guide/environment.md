# 環境構築

## .env の作成

```sh
cp .env.example .env
```

## DB の起動

```sh
mise run db:up
```

## マイグレーションの適用

```sh
mise run db:migrate
```

## 開発サーバの起動

```sh
mise run dev
```

## ブラウザで表示

```sh
mise run view:app
```
