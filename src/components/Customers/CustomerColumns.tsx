"use client";
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
import { Customer } from "@/lib/customer";
import LoginDropdownMenuItem from "../LoginDropdownMenuItem";
import { useSearchParams } from "next/navigation";

const CustomerColumns: ColumnDef<Customer>[] = [
  {
    header: "Full Name",
    accessorKey: "full_name",
  },
  {
    header: "Address",
    accessorKey: "address",
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Registered
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "date_registered",
    cell: ({ row }) => {
      const original: string = row.getValue("date_registered");
      const final: string = new Date(original).toDateString();
      return final;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const customer: Customer = row.original;
      const { full_name, address, sin, date_registered } = customer;
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
              onClick={() => navigator.clipboard.writeText(sin)}
            >
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/customers/${sin}`}>Edit customer</Link>
            </DropdownMenuItem>
            <LoginDropdownMenuItem
              full_name={full_name}
              address={address}
              sin={sin}
              date_registered={date_registered}
            ></LoginDropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default CustomerColumns;
