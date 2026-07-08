export const entityMessages = {
  notFound: (entityLabel: string) => `${entityLabel}が見つかりません`,
  notAssignable: (entityLabel: string) =>
    `存在しない${entityLabel}が指定されています`,
  inUse: (labels: {
    readonly entityLabel: string
    readonly assignedToLabel: string
  }) =>
    `${labels.assignedToLabel}に割り当てられている${labels.entityLabel}は削除できません`,
  conflict: (entityLabel: string) =>
    `${entityLabel}は他の操作によって更新されています`,
} as const
