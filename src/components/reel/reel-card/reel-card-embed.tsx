declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void
      }
    }
  }
}


import { Card, CardContent } from "@/components/ui/card"
import { useEffect } from "react"

export function ReelCardEmbed({ url }: { url: string }) {
  useEffect(() => {
    // подключаем embed.js один раз
    if (!document.querySelector("#instagram-embed-script")) {
      const script = document.createElement("script")
      script.id = "instagram-embed-script"
      script.async = true
      script.src = "//www.instagram.com/embed.js"
      document.body.appendChild(script)
    } else {
      // если скрипт уже есть, обновляем вставки
      window.instgrm?.Embeds?.process()
    }
  }, [url])

  return (
    <Card className="max-w-xl mx-auto p-4">
      <CardContent>
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{
            background: "#FFF",
            border: 0,
            margin: "1px auto",
            maxWidth: "540px",
            width: "100%",
          }}
        >
        </blockquote>
      </CardContent>
    </Card>
  )
}
