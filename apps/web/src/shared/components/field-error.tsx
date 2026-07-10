export function FieldError({
  message,
}: {
  readonly message: string | undefined
}) {
  if (!message) {
    return null
  }

  return (
    <p role="alert" className="text-destructive text-sm">
      {message}
    </p>
  )
}
