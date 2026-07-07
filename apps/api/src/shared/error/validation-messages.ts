export const validationMessages = {
  required: (field: string) => `${field}を入力してください`,
  invalidValue: (field: string) => `${field}の値が不正です`,
  maxLength: (field: string, max: number) =>
    `${field}は${max}文字以内で入力してください`,
  maxCount: (field: string, max: number) =>
    `${field}は${max}件以内で指定してください`,
  nonNegativeInteger: (field: string) =>
    `${field}は0以上の整数で指定してください`,
} as const
