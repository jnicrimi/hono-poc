import { Link } from "@tanstack/react-router"
import { useState } from "react"
import type { Book } from "@/shared/api/generated/models"
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
import { useDeleteBook } from "../hooks/use-delete-book"
import { bookLabels } from "../text/book-labels"

export function BookRowActions({ book }: { readonly book: Book }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { mutate, isPending } = useDeleteBook()

  return (
    <div className="flex justify-end gap-2">
      <Link
        to="/books/$bookId"
        params={{ bookId: book.id }}
        search={true}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        {uiLabels.edit}
      </Link>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setConfirmOpen(true)}
      >
        {uiLabels.delete}
      </Button>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{bookLabels.deleteConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {bookLabels.deleteConfirmDescription(book.title)}
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
                  { id: book.id },
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
