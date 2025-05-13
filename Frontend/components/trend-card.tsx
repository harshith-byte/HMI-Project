import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TrendCardProps {
  title: string
  value: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
  description: string
}

export function TrendCard({ title, value, trend, icon, description }: TrendCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div
            className={`text-2xl font-bold ${trend === "up" ? "trend-value-up" : trend === "down" ? "trend-value-down" : ""}`}
          >
            {value}
          </div>
          <div>{icon}</div>
        </div>
        <CardDescription className="mt-2 text-xs">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
