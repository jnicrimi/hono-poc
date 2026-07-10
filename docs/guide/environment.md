# 環境構築

## .env の作成

```sh
cp .env.example .env
```

## データベースの起動

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

## ローカル環境をブラウザで表示

```sh
mise run view:app
```
