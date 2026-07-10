import { existsSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitepress"

function dbSidebar() {
  const dir = fileURLToPath(new URL("../db", import.meta.url))
  if (!existsSync(dir)) return []
  const items = readdirSync(dir)
    .filter((file) => file.startsWith("public.") && file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "")
      return { text: slug.replace(/^public\./, ""), link: `/db/${slug}` }
    })
  return [{ text: "Tables", items }]
}

export default defineConfig({
  lang: "ja-JP",
  title: "Hono Poc – Docs",
  description: "Hono Poc development documentation",
  base: "/hono-poc/",
  outDir: "../dist",
  rewrites: { "db/README.md": "db/index.md" },
  transformPageData(pageData) {
    if (pageData.relativePath.startsWith("db/")) {
      pageData.frontmatter.aside = false
    }
  },
  themeConfig: {
    outline: { label: "目次" },
    nav: [
      { text: "Guide", link: "/guide/setup" },
      { text: "Database Schema", link: "/db/" },
      {
        text: "ER Diagram",
        link: "/erd/",
        target: "_blank",
        rel: "noreferrer",
      },
      {
        text: "Storybook",
        link: "/storybook/",
        target: "_blank",
        rel: "noreferrer",
      },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "初期設定", link: "/guide/setup" },
            { text: "環境構築", link: "/guide/environment" },
          ],
        },
      ],
      "/db/": dbSidebar(),
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/jnicrimi/hono-poc" },
    ],
  },
})
