import { useListBooksSuspense } from "@/shared/api/generated/endpoints/books/books"
import { ListPagination } from "@/shared/components/list-pagination"
import { Card, CardContent } from "@/shared/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { bookLabels } from "../text/book-labels"
import { BookRowActions } from "./book-row-actions"

export function BookList({ page }: { readonly page: number }) {
  const { data } = useListBooksSuspense({ page })

  if (data.items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          {data.pagination.total === 0 ? bookLabels.empty : bookLabels.notFound}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{bookLabels.title}</TableHead>
              <TableHead>{bookLabels.authors}</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>
                  {book.authors.map((author) => author.name).join("、")}
                </TableCell>
                <TableCell>
                  <BookRowActions book={book} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ListPagination
          to="/books"
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
        />
      </CardContent>
    </Card>
  )
}
