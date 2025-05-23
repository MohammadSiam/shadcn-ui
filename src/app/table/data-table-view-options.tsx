"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";
import { Settings2, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Payment } from "./column";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  // Function to export selected rows to PDF
  const exportSelectedToPDF = () => {
    const doc = new jsPDF();
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    if (selectedRows.length === 0) return;

    const tableData = selectedRows.map((row) => {
      const data = row.original as Payment;
      return [
        data.id,
        data.email,
        data.status,
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.amount),
      ];
    });

    // Generate PDF
    autoTable(doc, {
      head: [["ID", "Email", "Status", "Amount"]],
      body: tableData,
    });

    doc.save("selected-payments.pdf");
  };

  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex items-center gap-2">
      {selectedRowsCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          onClick={exportSelectedToPDF}
        >
          <FileDown className="h-4 w-4" />
          Export {selectedRowsCount} {selectedRowsCount === 1 ? "row" : "rows"}
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <Settings2 />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
