import { useGetAuthorsSuspense } from "@/shared/api/generated/endpoints/authors/authors"
import { Card, CardContent } from "@/shared/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { authorLabels } from "../text/author-labels"
import { AuthorPagination } from "./author-pagination"
import { AuthorRowActions } from "./author-row-actions"

export function AuthorList({ page }: { readonly page: number }) {
  const { data } = useGetAuthorsSuspense({ page })

  if (data.items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          {data.pagination.total === 0
            ? authorLabels.empty
            : authorLabels.notFound}
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
              <TableHead>{authorLabels.name}</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((author) => (
              <TableRow key={author.id}>
                <TableCell>{author.name}</TableCell>
                <TableCell>
                  <AuthorRowActions author={author} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AuthorPagination
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
        />
      </CardContent>
    </Card>
  )
}
