"use client";
import { formatPhoneNumber } from "@/lib/utils";
import { HotelChain } from "@/lib/hotelChain";
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
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import slugify from "slugify";

const HotelChainColumns: ColumnDef<HotelChain>[] = [
  {
    header: "Hotel Chain",
    accessorKey: "chain_name",
  },
  {
    header: "Central Address",
    accessorKey: "central_address",
  },
  {
    header: "Phone Numbers",
    accessorKey: "phone_numbers",
    accessorFn: (row) =>
      row.phone_numbers.map((number) => formatPhoneNumber(number)).join(" "),
    cell: ({ row }) => {
      return (
        <div className="max-w-[110px]">{row.getValue("phone_numbers")}</div>
      );
    },
  },
  {
    header: "Email Addresses",
    accessorKey: "email_addresses",
    accessorFn: (row) => row.email_addresses.join(" "),
    cell: ({ row }) => {
      return (
        <div className="max-w-[175px]">{row.getValue("email_addresses")}</div>
      );
    },
  },
  {
    header: "Number of Hotels",
    accessorKey: "number_hotels",
    accessorFn: (row) => row.number_hotels || "N/A",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("number_hotels")}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const hotelChain = row.original;
      const { chain_name } = hotelChain;
      const chainSlug = slugify(chain_name, { lower: true });

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
              onClick={() => navigator.clipboard.writeText(chain_name)}
            >
              Copy Hotel Chain Name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/admin/${chainSlug}`}>
                Edit the {chain_name} Hotel Chain
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default HotelChainColumns;
