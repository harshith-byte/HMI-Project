import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface QuickInsightProps {
  title: string
  value: string
  description: string
}

export function QuickInsight({ title, value, description }: QuickInsightProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}</div>
        <CardDescription className="mt-1 text-xs">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
