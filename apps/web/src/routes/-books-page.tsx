import { Book } from "lucide-react"
import { PageTitle } from "@/shared/components/page-title"
import { Button } from "@/shared/ui/button"

export function BooksPage() {
  return (
    <PageTitle icon={Book} action={<Button>登録</Button>}>
      書籍
    </PageTitle>
  )
}
