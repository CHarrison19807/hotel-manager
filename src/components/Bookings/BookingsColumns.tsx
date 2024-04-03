"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Booking } from "@/lib/booking";
import { formatPrice, unslugify } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import SetIsRentingButton from "./SetIsRentingDropdownItem";
import DeleteBookingDropdownItem from "./DeleteBookingDropdownItem";

const BookingColumns: ColumnDef<Booking>[] = [
  {
    header: "Booking ID",
    accessorKey: "booking_id",
    cell: ({ row }) => {
      const original: string = row.getValue("booking_id");
      const final: string = original.replace(
        /(\d{3})(\d{3})(\d{3})/,
        "$1-$2-$3"
      );
      return final;
    },
  },
  {
    header: "Customer SIN",
    accessorKey: "customer_sin",
    cell: ({ row }) => {
      const original: string = row.getValue("customer_sin");
      const final: string = original.replace(
        /(\d{3})(\d{3})(\d{3})/,
        "$1-$2-$3"
      );
      return final;
    },
  },
  {
    header: "Hotel",
    accessorKey: "hotel",
    accessorFn: (row) => unslugify(row.hotel_slug),
  },
  {
    header: "Room Number",
    accessorKey: "room_number",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Check In Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "check_in",
    cell: ({ row }) => {
      const original: string = row.getValue("check_in");
      const final: string = new Date(original).toDateString();
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
          Check Out Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "check_out",
    cell: ({ row }) => {
      const original: string = row.getValue("check_out");
      const final: string = new Date(original).toDateString();
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
          Total Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "total_cost",
    cell: ({ row }) => {
      const original: string = row.getValue("total_cost");
      const final: string = formatPrice(original);
      return final;
    },
  },
  {
    id: "is_renting",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Renting
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "is_renting",
    cell: ({ row }) => {
      const original: boolean = row.getValue("is_renting");
      const final: string = original ? "Yes" : "No";
      return final;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const booking: Booking = row.original;
      const { booking_id } = booking;

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
              onClick={() =>
                navigator.clipboard.writeText(booking_id as string)
              }
            >
              Copy booking ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteBookingDropdownItem booking={booking} />
            <SetIsRentingButton booking={booking} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default BookingColumns;
