# Scalar

Scalar は CDN に依存せず、`apps/api/vendor/scalar/standalone.js` にバンドルをセルフホストしている。バージョンを上げる場合は手動で更新する。

## 更新手順

`mise-tasks/vendor.toml` の `SCALAR_VERSION` を更新してから、バンドルを再取得する。

```sh
mise run vendor:scalar
```

API サーバを起動し、Scalar をブラウザで開いて表示を確認する。

```sh
mise run view:api-docs
```

確認後、`mise-tasks/vendor.toml` と `apps/api/vendor/scalar/standalone.js` をコミットする。
