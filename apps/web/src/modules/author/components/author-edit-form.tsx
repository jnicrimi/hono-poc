import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ApiError } from "@/shared/api/api-error"
import { patchAuthorsIdBodyNameMax } from "@/shared/api/generated/endpoints/authors/authors.zod"
import type { Author } from "@/shared/api/generated/models"
import { FieldError } from "@/shared/components/field-error"
import { feedbackMessages } from "@/shared/text/feedback-messages"
import { uiLabels } from "@/shared/text/ui-labels"
import { validationMessages } from "@/shared/text/validation-messages"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { useUpdateAuthor } from "../hooks/use-update-author"
import { authorLabels } from "../text/author-labels"

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, validationMessages.required(authorLabels.name))
    .max(
      patchAuthorsIdBodyNameMax,
      validationMessages.maxLength(
        authorLabels.name,
        patchAuthorsIdBodyNameMax,
      ),
    ),
})

type FormValues = z.infer<typeof formSchema>

export function AuthorEditForm({ author }: { readonly author: Author }) {
  const { mutate, isPending, error } = useUpdateAuthor(author.id)
  const isConflict = error instanceof ApiError && error.status === 409
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: { name: author.name },
  })
  const nameError = form.formState.errors.name

  const onSubmit = (values: FormValues) => {
    mutate({
      id: author.id,
      data: { name: values.name, version: author.version },
    })
  }

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event)
      }}
    >
      <FieldError
        message={isConflict ? feedbackMessages.conflictReload : undefined}
      />
      <div className="flex flex-col gap-2">
        <Label htmlFor="author-name">{authorLabels.name}</Label>
        <Input
          id="author-name"
          aria-invalid={nameError ? true : undefined}
          {...form.register("name")}
        />
        <FieldError message={nameError?.message} />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={!form.formState.isDirty || isPending}>
          {uiLabels.update}
        </Button>
      </div>
    </form>
  )
}
