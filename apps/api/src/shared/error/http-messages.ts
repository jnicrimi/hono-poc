export const httpMessages = {
  internalServerError: "サーバーエラーが発生しました",
  routeNotFound: "リクエストされたリソースが見つかりません",
  invalidRequest: "リクエストの内容が正しくありません",
  unsupportedMediaType: "リクエストの Content-Type に対応していません",
  payloadTooLarge: "リクエストのサイズが大きすぎます",
  gatewayTimeout: "リクエストがタイムアウトしました",
} as const
