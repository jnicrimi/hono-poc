export const validationMessages = {
  required: (label: string) => `${label}を入力してください`,
  requiredSelection: (label: string) => `${label}を選択してください`,
  maxLength: (label: string, max: number) =>
    `${label}は${max}文字以内で入力してください`,
  maxCount: (label: string, max: number) =>
    `${label}は${max}件以内で指定してください`,
  invalidValue: (label: string) => `${label}の値が不正です`,
} as const
