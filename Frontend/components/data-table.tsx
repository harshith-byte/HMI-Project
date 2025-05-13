"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps {
  data: any[];
}

export function DataTable({ data }: DataTableProps) {
  // Extract headers dynamically from the first row
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  console.log(data);

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead
                key={header}
                className={index === 0 ? "" : "text-right capitalize"}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((key, index) => (
                <TableCell
                  key={key}
                  className={index === 0 ? "font-medium" : "text-right"}
                >
                  {typeof row[key] === "number" ? `${row[key]}%` : row[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
