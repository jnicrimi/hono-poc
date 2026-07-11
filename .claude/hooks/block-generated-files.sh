#!/bin/bash
set -euo pipefail

# Edit / Write の対象が生成ファイルの場合にブロックする PreToolUse hook
file_path=$(jq -r '.tool_input.file_path // empty')

[ -z "$file_path" ] && exit 0

case "$file_path" in
  *apps/web/src/shared/api/generated/*)
    echo "orval が自動生成するファイルのため直接編集しない" >&2
    exit 2
    ;;
  *apps/web/src/route-tree.gen.ts)
    echo "TanStack Router が自動生成するファイルのため直接編集しない" >&2
    exit 2
    ;;
  *apps/api/openapi.json)
    echo "zod スキーマから自動生成するファイルのため直接編集しない" >&2
    exit 2
    ;;
  *apps/api/drizzle/*)
    echo "drizzle-kit が自動生成するファイルのため直接編集しない" >&2
    exit 2
    ;;
  *apps/api/vendor/*)
    echo "外部から取り込んだベンダーコードのため直接編集しない" >&2
    exit 2
    ;;
  *docs/db/*)
    echo "tbls が自動生成するファイルのため直接編集しない" >&2
    exit 2
    ;;
  *pnpm-lock.yaml)
    echo "pnpm が自動生成するファイルのため直接編集しない" >&2
    exit 2
    ;;
esac

exit 0
