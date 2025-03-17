"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { generateResponse } from "@/lib/actions"

interface AIResponse {
  idea: string
  script: string
  tags: string
}

export function AIAssistant() {
  const [userMessage, setUserMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userMessage.trim()) return

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("user_message", userMessage)
      formData.append("source", "write_script")

      const response = await generateResponse(formData)
      setAiResponse(response as AIResponse)
    } catch (error) {
      console.error("Error generating response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setAiResponse(null)
  }

  return (
    <Card className="bg-slate-800/30 border-slate-700 h-full">
      <CardContent className="p-6 h-full flex flex-col">
        {aiResponse ? (
          <div className="space-y-4 flex-1">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="mb-1 font-medium">Идея:</p>
              <p className="text-muted-foreground">{aiResponse.idea}</p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="mb-1 font-medium">Текст озвучки:</p>
              <p className="text-muted-foreground">{aiResponse.script}</p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="mb-1 font-medium">Теги:</p>
              <p className="text-muted-foreground">{aiResponse.tags}</p>
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Переделать
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUserMessage("")
                  setAiResponse(null)
                }}
              >
                Написать другой запрос
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">Нет идей?</h2>
              <p className="text-muted-foreground">Спросите у AI сценариста</p>
            </div>

            <div className="flex justify-center mb-4 flex-1">
              <Image src="/images/botpic.png" alt="AI Assistant" width={200} height={150} className="rounded-lg" />
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-lg">Подождите, идет обработка запроса...</p>
              </div>
            ) : (
              <form onSubmit={handleAskAi} className="space-y-4 mt-auto">
                <Textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="История про работу автосервиса во время карантина...."
                  className="bg-slate-800/50 border-slate-700"
                  rows={4}
                />
                <Button type="submit" className="w-full" disabled={!userMessage.trim()}>
                  Спросить Starmake AI
                </Button>
              </form>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

