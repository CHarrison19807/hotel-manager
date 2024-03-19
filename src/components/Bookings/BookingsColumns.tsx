"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Booking } from "@/lib/booking";
import { formatPrice, unslugify } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

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
    accessorKey: "check_in_date",
    cell: ({ row }) => {
      const original: string = row.getValue("check_in_date");
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
    accessorKey: "check_out_date",
    cell: ({ row }) => {
      const original: string = row.getValue("check_out_date");
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
];

export default BookingColumns;
