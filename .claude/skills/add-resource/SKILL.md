---
name: add-resource
description: リソースを追加する際の手順。実装の順序と登録漏れチェックリストを提供する。
---

# リソース追加手順

リソースを追加する手順。各領域の規約は `.claude/rules/` の該当ファイルに従い、本スキルは順序とチェックリストのみを定める。

## 手順

1. リソースの配置先を判断する
   - リソースが既存モジュールの機能単位に収まるなら既存モジュールへ追加し、独立した機能単位なら新規モジュールを作成する
   - 新規モジュールを作成する場合は、モジュール名の候補を提示してユーザーの承認を得る
   - 判断に迷う場合はユーザーに確認する
2. API 側を実装する
   - `apps/api/src/modules/<name>/` に実装する
3. DB スキーマを反映する
   - マイグレーションを生成・適用し、DB ドキュメントを再生成する
4. DI を登録する（新規モジュールの場合のみ）
5. API クライアントを再生成する
   - `mise run api-client:generate` を実行する
6. web 側を実装する
   - `apps/web/src/modules/<name>/` とルートを実装する
7. 検証する
   - `mise run lint` / `mise run typecheck` / `mise run knip` / `mise run depcruise` を全て通す
   - `mise run test-api` / `mise run test-web` を実行する
   - e2e を追加した場合は `mise run test-e2e` を実行する

## 登録漏れチェックリスト

### 共通

- [ ] `.tbls.yml` の `comments` にテーブル・カラムのコメントを定義した

### 新規モジュールの場合

- [ ] api — `shared/di/register-<name>-module.ts` を `container.ts` から呼び出した
- [ ] api — `<name>ApiTag` を `openApiDocConfig` に追加した
- [ ] web — Orval が生成したモックを `msw-server.ts` の `setupServer` に登録した
