# Scalar API Reference

`standalone.js` は [@scalar/api-reference](https://www.npmjs.com/package/@scalar/api-reference) のバンドルのコピー。
CDN に依存せずセルフホストするためリポジトリに含めている。

- 取得元: `https://cdn.jsdelivr.net/npm/@scalar/api-reference@<version>/dist/browser/standalone.js`
- バージョン: `mise-tasks/vendor.toml` の `SCALAR_VERSION` を参照

## 更新手順

1. `mise-tasks/vendor.toml` の `SCALAR_VERSION` を更新する
2. `mise run vendor:scalar` を実行して `standalone.js` を再取得する
3. 動作確認のうえ両ファイルをコミットする
