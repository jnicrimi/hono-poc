# API クライアント

API を変更した場合は OpenAPI スペックと API クライアントを再生成する。

## クライアントの生成

```sh
mise run api-client:generate
```

ファイルが生成されるので、変更をコミットする。

- `apps/api/openapi.json`
- `apps/web/src/shared/api/generated/`

### 生成ファイル

- OpenAPI スペック
- react-query クライアント
- zod スキーマ
- MSW モック

## API ドキュメントの確認

API サーバを起動する。

```sh
mise run dev
```

Scalar をブラウザで開く。

```sh
mise run view:api-docs
```
