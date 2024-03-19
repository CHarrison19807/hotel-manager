"use client";
import { formatPhoneNumber, unslugify } from "@/lib/utils";
import { Hotel } from "@/lib/hotel";
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
import slugify from "slugify";

const HotelColumns: ColumnDef<Hotel>[] = [
  {
    header: "Hotel Chain",
    accessorKey: "chain_slug",
    accessorFn: (row) => unslugify(row.chain_slug),
  },
  {
    header: "Hotel",
    accessorKey: "hotel_name",
  },

  {
    header: "Address",
    accessorKey: "address",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "rating",
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
    header: "Number of Rooms",
    accessorKey: "number_rooms",
    accessorFn: (row) => row.number_rooms || "N/A",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("number_rooms")}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const hotel = row.original;
      const { hotel_name, chain_slug } = hotel;
      const hotelSlug = slugify(hotel_name, { lower: true });

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
              onClick={() => navigator.clipboard.writeText(hotel_name)}
            >
              Copy hotel name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/admin/${chain_slug}/${hotelSlug}`}>Edit hotel</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default HotelColumns;
