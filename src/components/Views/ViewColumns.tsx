"use client";
import { ColumnDef } from "@tanstack/react-table";
import { HotelCapacity, RoomCount } from "@/lib/views";

const HotelCapacityColumns: ColumnDef<HotelCapacity>[] = [
  {
    header: "Hotel",
    accessorKey: "hotel_name",
  },
  {
    header: "Total Capacity",
    accessorKey: "total_capacity",
  },
];

const RoomRatingColumns: ColumnDef<RoomCount>[] = [
  {
    header: "Hotel Rating",
    accessorKey: "rating",
  },
  {
    header: "Available Rooms",
    accessorKey: "count",
  },
];

export { HotelCapacityColumns, RoomRatingColumns };
