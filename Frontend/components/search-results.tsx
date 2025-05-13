"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, BarChart, FileText, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: string;
  type: "report" | "data" | "trend";
  title: string;
  description: string;
  date?: string;
  category?: string;
  url: string;
}

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export function SearchResults({ query, onClose }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Sample data for demonstration
  const sampleData: SearchResult[] = [
    {
      id: "report-1",
      type: "report",
      title: "Germany's Economic Outlook – Q1 2024",
      description:
        "Overview of Germany's economic performance in the first quarter with projections for the rest of the year.",
      date: "March 15, 2024",
      category: "Economic Outlook",
      url: "/audio-reports",
    },
    {
      id: "report-2",
      type: "report",
      title: "Regional Economic Disparities in Germany",
      description:
        "Analysis of economic performance across different German regions and states.",
      date: "February 28, 2024",
      category: "Regional Analysis",
      url: "/audio-reports",
    },
    {
      id: "data-1",
      type: "data",
      title: "Employment Rate by Region (2020-2024)",
      description: "Quarterly employment rate data across German regions.",
      category: "Employment",
      url: "/explore-data",
    },
    {
      id: "data-2",
      type: "data",
      title: "Inflation Trends (2020-2024)",
      description: "Monthly inflation data with seasonal adjustments.",
      category: "Inflation",
      url: "/explore-data",
    },
    {
      id: "trend-1",
      type: "trend",
      title: "Manufacturing Sector Growth",
      description:
        "Recent upward trend in manufacturing output across Germany.",
      date: "Q1 2024",
      category: "Industry",
      url: "/explore-data",
    },
    {
      id: "trend-2",
      type: "trend",
      title: "Consumer Spending Decline",
      description: "Decreasing trend in consumer spending in urban centers.",
      date: "Q1 2024",
      category: "Consumer",
      url: "/explore-data",
    },
  ];

  // Simulate search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Simulate API call delay
    const timer = setTimeout(() => {
      const filteredResults = sampleData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          (item.category &&
            item.category.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filteredResults);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Filter results by type based on active tab
  const filteredResults =
    activeTab === "all"
      ? results
      : results.filter((result) => result.type === activeTab);

  // Get icon based on result type
  const getIcon = (type: string) => {
    switch (type) {
      case "report":
        return <FileText className="h-4 w-4" />;
      case "data":
        return <BarChart className="h-4 w-4" />;
      case "trend":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get badge color based on result type
  const getBadgeVariant = (
    type: string
  ): "default" | "secondary" | "outline" => {
    switch (type) {
      case "report":
        return "default";
      case "data":
        return "secondary";
      case "trend":
        return "outline";
      default:
        return "default";
    }
  };

  if (!query.trim()) {
    return null;
  }

  return (
    <Card className="absolute top-full mt-2 left-0 right-0 z-50 shadow-lg max-h-[80vh] overflow-auto">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              {loading
                ? "Searching..."
                : `${filteredResults.length} results for "${query}"`}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="report">Reports</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="trend">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-muted-foreground">
                  Searching...
                </div>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-2">
                  Try using different keywords or browse categories
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredResults.map((result) => (
                  <Link href={result.url} key={result.id} onClick={onClose}>
                    <div className="p-3 hover:bg-muted rounded-md transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          {getIcon(result.type)}
                          <span className="font-medium ml-2">
                            {result.title}
                          </span>
                        </div>
                        <Badge
                          variant={getBadgeVariant(result.type)}
                          className="ml-2"
                        >
                          {result.type === "report"
                            ? "Report"
                            : result.type === "data"
                            ? "Data"
                            : "Trend"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.description}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        {result.category && (
                          <span className="mr-3">{result.category}</span>
                        )}
                        {result.date && <span>{result.date}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
