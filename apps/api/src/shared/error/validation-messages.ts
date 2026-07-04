export const validationMessages = {
  required: (field: string) => `${field}を入力してください`,
  invalidValue: (field: string) => `${field}の値が不正です`,
  maxLength: (field: string, max: number) =>
    `${field}は${max}文字以内で入力してください`,
} as const
