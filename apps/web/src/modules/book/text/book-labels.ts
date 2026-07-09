export const bookLabels = {
  title: "書籍タイトル",
  authors: "著者",
  empty: "書籍が登録されていません",
  notFound: "書籍が存在しません",
  createTitle: "書籍の登録",
  editTitle: "書籍の編集",
  deleteConfirmTitle: "書籍を削除しますか？",
  deleteConfirmDescription: (title: string) =>
    `「${title}」を削除します。この操作は取り消せません。`,
} as const
