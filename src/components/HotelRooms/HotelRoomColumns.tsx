"use client";
import { formatPrice, unslugify } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { HotelRoom } from "@/lib/hotelRoom";
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

const HotelRoomColumns: ColumnDef<HotelRoom>[] = [
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
    header: "Price",
    accessorKey: "price",
    cell: ({ row }) => {
      return <div>{formatPrice(row.getValue("price"))}</div>;
    },
  },
  {
    header: "Damages",
    accessorKey: "damages",
    accessorFn: (row) => row.damages?.join(", ") || "None",
  },
  {
    header: "Amenities",
    accessorKey: "amenities",
    accessorFn: (row) => row.amenities?.join(", ") || "None",
  },
  {
    header: "Extended",
    accessorKey: "extended",
    accessorFn: (row) => (row.extended ? "Yes" : "No"),
  },
  {
    header: "View",
    accessorKey: "view",
    cell: ({ row }) => {
      const view: string = row.getValue("view");
      const final = view.charAt(0).toUpperCase() + view.slice(1);
      return final;
    },
  },
  {
    header: "Capacity",
    accessorKey: "capacity",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("capacity")}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const hotelRoom = row.original;
      const { hotel_slug, room_number } = hotelRoom;

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
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/admin/${hotel_slug}/${room_number}`}>
                Edit Room {room_number}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default HotelRoomColumns;
