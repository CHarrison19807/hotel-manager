"use client";
import { unslugify } from "@/lib/utils";
import { Employee } from "@/lib/employee";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import LoginDropdownMenuItem from "../LoginDropdownMenuItem";

const EmployeeColumns: ColumnDef<Employee>[] = [
  {
    header: "Full Name",
    accessorKey: "full_name",
  },
  {
    header: "Address",
    accessorKey: "address",
  },
  {
    accessorKey: "role",
    cell: ({ row }) => {
      const value = row.getValue("role") === "manager" ? "Manager" : "Regular";
      return value;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    header: "Hotel",
    accessorKey: "hotel",
    accessorFn: (row) => unslugify(row.hotel_slug),
  },
  {
    header: "SIN",
    accessorKey: "sin",
    cell: ({ row }) => {
      const original: string = row.getValue("sin");
      const final: string = original.replace(
        /(\d{3})(\d{3})(\d{3})/,
        "$1-$2-$3"
      );
      return final;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const employee = row.original;
      const { full_name, address, sin, role, hotel_slug } = employee;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(employee.sin)}
            >
              Copy employee SIN
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/employees/${employee.sin}`}>Edit employee</Link>
            </DropdownMenuItem>
            <LoginDropdownMenuItem
              full_name={full_name}
              address={address}
              sin={sin}
              role={role}
              hotel_slug={hotel_slug}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default EmployeeColumns;
