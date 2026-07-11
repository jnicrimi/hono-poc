# Scalar

Scalar は CDN に依存せず、`apps/api/vendor/scalar/standalone.js` にバンドルをセルフホストしている。バージョンを上げる場合は手動で更新する。

## 更新手順

最新版のバンドルを取得する。

```sh
mise run vendor:scalar
```

API サーバを起動し、Scalar をブラウザで開いて表示を確認する。

```sh
mise run view:api-docs
```

確認後、`apps/api/vendor/scalar/standalone.js` をコミットする。
