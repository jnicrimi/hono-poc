import { useGetBooksSuspense } from "@/shared/api/generated/endpoints/books/books"
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
import { BookPagination } from "./book-pagination"

export function BookList({ page }: { readonly page: number }) {
  const { data } = useGetBooksSuspense({ page })

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
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{bookLabels.title}</TableHead>
                <TableHead>{bookLabels.authors}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>
                    {book.authors.map((author) => author.name).join("、")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <BookPagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
      />
    </div>
  )
}
