"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChartIcon, TrendingUp } from "lucide-react";

type VisualizationProps = {
  indicator: string;
  data?: any;
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export function ChatVisualization({ indicator, data }: VisualizationProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    // Generate sample data based on the indicator
    // In a real app, this would come from your API
    generateSampleData(indicator);
  }, [indicator]);

  const generateSampleData = (indicator: string) => {
    // Sample data generation based on indicator type
    if (indicator === "gender equality") {
      setChartData([
        { name: "Pay Gap", value: 18 },
        { name: "Leadership", value: 32 },
        { name: "Workforce", value: 46 },
        { name: "Education", value: 78 },
      ]);
      setPieData([
        { name: "Male CEOs", value: 82 },
        { name: "Female CEOs", value: 18 },
      ]);
    } else if (indicator === "labour") {
      setChartData([
        { name: "Unemployment", value: 6.1 },
        { name: "Job Growth", value: 2.3 },
        { name: "Vacancies", value: 3.8 },
        { name: "Part-time", value: 28.5 },
      ]);
      setPieData([
        { name: "Full-time", value: 71.5 },
        { name: "Part-time", value: 28.5 },
      ]);
    } else if (indicator === "marcoeconomy") {
      setChartData([
        { name: "GDP Growth", value: 0.9 },
        { name: "Inflation", value: 4.2 },
        { name: "Interest Rate", value: 3.5 },
        { name: "Trade Balance", value: 2.7 },
      ]);
      setPieData([
        { name: "Services", value: 68 },
        { name: "Manufacturing", value: 24 },
        { name: "Agriculture", value: 8 },
      ]);
    } else if (indicator === "health") {
      setChartData([
        { name: "Life Expectancy", value: 81.2 },
        { name: "Healthcare Spending", value: 11.7 },
        { name: "Hospital Beds", value: 8 },
        { name: "Physicians", value: 4.3 },
      ]);
      setPieData([
        { name: "Public Insurance", value: 88 },
        { name: "Private Insurance", value: 12 },
      ]);
    } else if (indicator === "finance") {
      setChartData([
        { name: "Stock Market", value: 5.8 },
        { name: "Bond Yields", value: 2.4 },
        { name: "Banking Assets", value: 7.2 },
        { name: "Household Debt", value: 3.9 },
      ]);
      setPieData([
        { name: "Equity", value: 35 },
        { name: "Bonds", value: 45 },
        { name: "Cash", value: 15 },
        { name: "Other", value: 5 },
      ]);
    } else {
      // Default data for other indicators
      setChartData([
        { name: "Metric 1", value: Math.floor(Math.random() * 100) },
        { name: "Metric 2", value: Math.floor(Math.random() * 100) },
        { name: "Metric 3", value: Math.floor(Math.random() * 100) },
        { name: "Metric 4", value: Math.floor(Math.random() * 100) },
      ]);
      setPieData([
        { name: "Category A", value: 45 },
        { name: "Category B", value: 55 },
      ]);
    }
  };

  if (indicator === "all") {
    return null;
  }

  return (
    <Card className="mb-4 overflow-hidden border border-blue-100">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
          {indicator.charAt(0).toUpperCase() + indicator.slice(1)} Visualization
        </h3>

        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="bar" className="text-xs">
              <BarChart3 className="h-3 w-3 mr-1" />
              Bar Chart
            </TabsTrigger>
            <TabsTrigger value="pie" className="text-xs">
              <PieChartIcon className="h-3 w-3 mr-1" />
              Pie Chart
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="mt-0">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1">
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pie" className="mt-0">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
