# テスト

## API

### 全テストの実行

```sh
mise run test-api
```

### 個別テストの実行

```sh
mise run test-api:unit
```

```sh
mise run test-api:integration
```

```sh
mise run test-api:api
```

インテグレーションテストは Testcontainers が PostgreSQL を自動起動するため、Docker が起動している必要がある。

### カバレッジ

```sh
mise run test-api:coverage
```

計測結果をブラウザで開く。

```sh
mise run view:api-coverage
```

## Web

### テストの実行

```sh
mise run test-web
```

### カバレッジ

```sh
mise run test-web:coverage
```

計測結果をブラウザで開く。

```sh
mise run view:web-coverage
```

## E2E

DB を起動し、マイグレーションを適用しておく。

```sh
mise run db:up
```

```sh
mise run db:migrate
```

```sh
mise run test-e2e
```
