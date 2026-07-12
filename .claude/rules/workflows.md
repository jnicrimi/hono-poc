---
paths:
  - ".github/workflows/**"
  - ".github/actions/**"
---

# GitHub Actions 規約

## 規約

- `uses` はコミット SHA でピン留めし、バージョンをコメントで併記する
- `permissions` は最小権限で明示する
- `concurrency` で同一 ref の実行をキャンセルする
- ジョブには `timeout-minutes` を設定する
- `on.pull_request` には `types` を明示する
- checkout には `persist-credentials: false` を指定する
- pnpm を使うジョブのセットアップは `.github/actions/setup` を使う

## リントツール

変更後は以下を通す。

- actionlint — `actionlint`（ワークフローの構文チェック）
- zizmor — `zizmor --persona=pedantic .`（セキュリティリント）
