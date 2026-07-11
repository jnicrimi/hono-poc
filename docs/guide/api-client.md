# API クライアント

API を変更した場合は API クライアントを再生成する。

## 前提

Orval が起動中の API サーバから OpenAPI スペック(`http://localhost:3000/api-docs/json`)を取得するため、API サーバを起動しておく。

```sh
mise run dev
```

## クライアントの生成

```sh
mise run api-client:generate
```

`apps/web/src/shared/api/generated/` にファイルが生成されるので、変更をコミットする。

### 生成ファイル

- react-query クライアント
- zod スキーマ
- MSW モック

## API ドキュメントの確認

Scalar をブラウザで開く。

```sh
mise run view:api-docs
```
