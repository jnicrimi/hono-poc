---
paths:
  - "apps/web/**"
---

# apps/web 規約

## ディレクトリ構成

- `src/app/`
  - シェル
  - プロバイダー
  - ルーター構成
- `src/routes/`
  - TanStack Router のファイルベースルート
- `src/modules/<name>/`
  - 機能単位のコード
- `src/shared/`
  - 横断コード

## 依存境界

- 境界ルールは `.dependency-cruiser.json` に日本語コメント付きで定義されている
- `mise run depcruise` で検証する

## 命名規則

- ファイル名は主要な export 名に対応する kebab-case とする
- mutation hook は `use-<動詞>-<エンティティ名>.ts` とする

## ルーティング

- ページ実体はルートファイルと同階層の `-` プレフィックスファイルに置く
- search params は `validateSearch` + zod スキーマで検証する
- loader で `context.queryClient.ensureQueryData` によりデータをプリフェッチする
- ナビリンクは `app-shell.tsx` の `NAV_ITEMS` に追加する

## API アクセス

- API 呼び出しは orval が生成したクライアント（`shared/api/generated/`）を経由する
- フォームのバリデーションは orval が生成した zod 定数を再利用する
- 読み取りは orval が生成した Suspense hook を使い、独自の loading / error 分岐を書かない
- loading は Suspense、取得エラーは `RouteErrorBoundary` に委譲する
- 更新系 mutation の onError は 409 を先に判定し、`shared/text` の競合メッセージを表示する

## ページネーション

- 一覧のページングは共有の `ListPagination` で表示する
- 一覧ルートを追加したら `list-pagination.tsx` の `PaginatedListPath` に追加する

## 文言

- UI 文言は日本語で書く
- UI 文言は `text/` に集約する

## UI コンポーネント

- UI プリミティブは `shared/ui/` に置く

### 追加の手順

1. ユーザーの承認を得る
2. shadcn CLI で追加する

## テスト

- `*.test.tsx` は実装ファイルと同じディレクトリに配置する
- vitest + Testing Library + MSW（`onUnhandledRequest: "error"`）でテストする
- API タグを追加したら orval が生成したモックを `msw-server.ts` の `setupServer` に登録する
- ルートコンポーネントは `render-with-router.tsx` ヘルパーでレンダリングする
- describe には対象を書く
- タイトルには日本語の常体で操作と期待する結果を書く
