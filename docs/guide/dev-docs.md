# VitePress

開発ドキュメントをビルドしてプレビューする。

## 前提

ビルドの依存タスクで tbls / Liam が DB に接続するため、DB を起動し、マイグレーションを適用しておく。

```sh
mise run db:up
```

```sh
mise run db:migrate
```

## ビルド

`mise run dev-docs:build` を実行すると、以下が実行される。

1. DB ドキュメントの生成(tbls)
2. ER 図の生成(Liam)
3. Storybook のビルド
4. VitePress のビルド

```sh
mise run dev-docs:build
```

## プレビュー

```sh
mise run dev-docs:preview
```

### ブラウザで表示

```sh
mise run view:dev-docs
```
