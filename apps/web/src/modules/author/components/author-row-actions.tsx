import { Link } from "@tanstack/react-router"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import type { Author } from "@/shared/api/generated/models"
import { cn } from "@/shared/lib/utils"
import { uiLabels } from "@/shared/text/ui-labels"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog"
import { Button, buttonVariants } from "@/shared/ui/button"
import { useDeleteAuthor } from "../hooks/use-delete-author"
import { authorLabels } from "../text/author-labels"

export function AuthorRowActions({ author }: { readonly author: Author }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { mutate, isPending } = useDeleteAuthor()

  return (
    <div className="flex justify-end gap-2">
      <Link
        to="/authors/$authorId"
        params={{ authorId: author.id }}
        search={true}
        className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }))}
      >
        <Pencil />
        <span className="sr-only">{uiLabels.edit}</span>
      </Link>
      <Button
        variant="destructive"
        size="icon-sm"
        onClick={() => setConfirmOpen(true)}
      >
        <Trash2 />
        <span className="sr-only">{uiLabels.delete}</span>
      </Button>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {authorLabels.deleteConfirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {authorLabels.deleteConfirmDescription(author.name)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {uiLabels.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={() =>
                mutate(
                  { id: author.id },
                  { onSuccess: () => setConfirmOpen(false) },
                )
              }
            >
              {uiLabels.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
