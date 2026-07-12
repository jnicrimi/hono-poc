import { House } from "lucide-react"
import { PageTitle } from "@/shared/components/page-title"
import { navLabels } from "@/shared/text/nav-labels"

export function IndexPage() {
  return <PageTitle icon={House}>{navLabels.home}</PageTitle>
}
