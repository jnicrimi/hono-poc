import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { postAuthorsBodyNameMax } from "@/shared/api/generated/endpoints/authors/authors.zod"
import { uiLabels } from "@/shared/text/ui-labels"
import { validationMessages } from "@/shared/text/validation-messages"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { useCreateAuthor } from "../hooks/use-create-author"
import { authorLabels } from "../text/author-labels"

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, validationMessages.required(authorLabels.name))
    .max(
      postAuthorsBodyNameMax,
      validationMessages.maxLength(authorLabels.name, postAuthorsBodyNameMax),
    ),
})

type FormValues = z.infer<typeof formSchema>

export function AuthorCreateForm() {
  const { mutate, isPending } = useCreateAuthor()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  })
  const nameError = form.formState.errors.name

  const onSubmit = (values: FormValues) => {
    mutate({ data: { name: values.name } })
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
        <Label htmlFor="author-name">{authorLabels.name}</Label>
        <Input
          id="author-name"
          aria-invalid={nameError ? true : undefined}
          {...form.register("name")}
        />
        {nameError ? (
          <p role="alert" className="text-destructive text-sm">
            {nameError.message}
          </p>
        ) : null}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {uiLabels.create}
        </Button>
      </div>
    </form>
  )
}
