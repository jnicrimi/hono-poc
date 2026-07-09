export const authorLabels = {
  name: "著者名",
  empty: "著者が登録されていません",
  notFound: "著者が存在しません",
  selectPlaceholder: "著者を選択",
  searchPlaceholder: "著者を検索",
  searchEmpty: "著者が見つかりません",
  selectedCount: (count: number) => `${count}名の著者`,
  createTitle: "著者の登録",
  editTitle: "著者の編集",
  deleteConfirmTitle: "著者を削除しますか？",
  deleteConfirmDescription: (name: string) =>
    `「${name}」を削除します。この操作は取り消せません。`,
} as const
