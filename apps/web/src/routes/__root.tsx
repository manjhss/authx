import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"

import "@workspace/ui/styles/globals.css"
import { ThemeProvider } from "@workspace/ui/theme-provider"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "authx",
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="authx-ui-theme">
          {children}
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
