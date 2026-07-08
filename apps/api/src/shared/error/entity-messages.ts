export const entityMessages = {
  notFound: (entityLabel: string) => `${entityLabel}が見つかりません`,
  notAssignable: (entityLabel: string) =>
    `存在しない${entityLabel}が指定されています`,
  conflict: (entityLabel: string) =>
    `${entityLabel}は他の操作によって更新されています`,
} as const
