export const validationMessages = {
  required: (label: string) => `${label}を入力してください`,
  maxLength: (label: string, max: number) =>
    `${label}は${max}文字以内で入力してください`,
} as const
