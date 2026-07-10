import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AuthorMultiSelect } from "@/modules/author/components/author-multi-select"
import { useAuthorOptions } from "@/modules/author/hooks/use-author-options"
import {
  postBooksBodyAuthorIdsMax,
  postBooksBodyTitleMax,
} from "@/shared/api/generated/endpoints/books/books.zod"
import { FieldError } from "@/shared/components/field-error"
import { uiLabels } from "@/shared/text/ui-labels"
import { validationMessages } from "@/shared/text/validation-messages"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { useCreateBook } from "../hooks/use-create-book"
import { bookLabels } from "../text/book-labels"

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, validationMessages.required(bookLabels.title))
    .max(
      postBooksBodyTitleMax,
      validationMessages.maxLength(bookLabels.title, postBooksBodyTitleMax),
    ),
  authorIds: z
    .array(z.uuid(validationMessages.invalidValue(bookLabels.authors)))
    .min(1, validationMessages.requiredSelection(bookLabels.authors))
    .max(
      postBooksBodyAuthorIdsMax,
      validationMessages.maxCount(
        bookLabels.authors,
        postBooksBodyAuthorIdsMax,
      ),
    ),
})

type FormValues = z.infer<typeof formSchema>

export function BookCreateForm() {
  const { mutate, isPending } = useCreateBook()
  const authors = useAuthorOptions()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", authorIds: [] },
  })
  const titleError = form.formState.errors.title
  const authorIdsError = form.formState.errors.authorIds

  const onSubmit = (values: FormValues) => {
    mutate({ data: { title: values.title, authorIds: values.authorIds } })
  }

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event)
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="book-title">{bookLabels.title}</Label>
        <Input
          id="book-title"
          aria-invalid={titleError ? true : undefined}
          {...form.register("title")}
        />
        <FieldError message={titleError?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>{bookLabels.authors}</Label>
        <AuthorMultiSelect
          options={authors}
          value={form.watch("authorIds")}
          onChange={(next) =>
            form.setValue("authorIds", [...next], {
              shouldValidate: form.formState.isSubmitted,
              shouldDirty: true,
            })
          }
        />
        <FieldError message={authorIdsError?.message} />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {uiLabels.create}
        </Button>
      </div>
    </form>
  )
}
