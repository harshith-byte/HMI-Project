// DataChart.tsx
"use client";

import {
  Bar,
  BarChart,
  Line,
  Cell,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "next-themes";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DataChartProps {
  type: "line" | "bar" | "pie";
  data: any[];
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#d0ed57",
];

export function DataChart({ type, data }: DataChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const axisColor = isDark ? "#888" : "#666";

  let transformedData = data;

  const isConstructionDataset =
    Array.isArray(data) &&
    data.length > 0 &&
    "label" in data[0] &&
    "values" in data[0];

  if (type === "line" && isConstructionDataset) {
    transformedData = data[0].values.map((yearData) => {
      const result: Record<string, string | number> = {
        quarter: yearData.year,
      };
      data.forEach((category) => {
        const matchingYearData = category.values.find(
          (v) => v.year === yearData.year
        );
        if (matchingYearData) {
          result[category.label] = matchingYearData.percent;
        }
      });
      return result;
    });
  }

  if (type === "line") {
    const isLineChartData =
      transformedData.length > 0 && "quarter" in transformedData[0];

    if (isLineChartData) {
      const firstItem = transformedData[0];
      const categories = Object.keys(firstItem).filter(
        (key) => key !== "quarter" && key !== "value"
      );

      return (
        <ChartContainer
          config={{
            value: {
              label: "Construction Growth (%)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <LineChart
            data={transformedData}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <XAxis
              dataKey="quarter"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke={axisColor}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={["auto", "auto"]}
              tickCount={5}
              stroke={axisColor}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<ChartTooltipContent format="{value}%" />} />
            <Legend />

            {categories.map((category, index) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                name={category}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      );
    }

    return (
      <ChartContainer
        config={{
          value: {
            label: "Employment Rate",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[300px]"
      >
        <LineChart
          data={transformedData}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <XAxis
            dataKey="quarter"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            stroke={axisColor}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={["auto", "auto"]}
            tickCount={5}
            stroke={axisColor}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-employment)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    );
  }

  if (type === "bar") {
    return (
      <ChartContainer
        config={{
          value: {
            label: "Construction Growth (%)",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[300px]"
      >
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <XAxis
            dataKey="region"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            stroke={axisColor}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={["auto", "auto"]}
            tickCount={4}
            stroke={axisColor}
            tickFormatter={(value) => `${value}%`}
          />
          <ChartTooltip content={<ChartTooltipContent format="{value}%" />} />
          <Bar dataKey="value" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    );
  }

  if (type === "pie") {
    return (
      <ChartContainer
        config={{
          value: {
            label: "Construction by Sector",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name || "Label"} ${value || 0}%`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip
              formatter={(value) => [`${value}%`, "Count"]}
              contentStyle={{
                backgroundColor: isDark ? "hsl(var(--background))" : "#fff",
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground))",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  return null;
}
