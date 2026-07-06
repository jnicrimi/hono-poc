export const toLimitOffset = ({
  page,
  perPage,
}: {
  readonly page: number
  readonly perPage: number
}): { readonly limit: number; readonly offset: number } => {
  const limit = perPage
  const offset = (page - 1) * perPage
  return { limit, offset }
}
