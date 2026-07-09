import { User } from "lucide-react"
import { PageTitle } from "@/shared/components/page-title"
import { Button } from "@/shared/ui/button"

export function AuthorsPage() {
  return (
    <PageTitle icon={User} action={<Button>登録</Button>}>
      著者
    </PageTitle>
  )
}
