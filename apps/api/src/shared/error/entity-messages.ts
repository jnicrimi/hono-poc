export const entityMessages = {
  notFound: (entityLabel: string) => `${entityLabel}が見つかりません`,
  conflict: (entityLabel: string) =>
    `${entityLabel}は他の操作によって更新されています`,
} as const
