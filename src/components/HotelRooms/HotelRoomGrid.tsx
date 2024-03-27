"use client";
import { useState } from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { HotelRoom } from "@/lib/hotelRoom";
import { generateID, getDatesBetween } from "@/lib/utils";
import HotelRoomItem from "./HotelRoomItem";
import { Button } from "../ui/button";
import { Booking } from "@/lib/booking";

interface HotelRoomGridProps {
  hotelRooms: HotelRoom[];
  bookings: Booking[];
}

const ITEMS_PER_PAGE = 12;

const HotelRoomGrid = (props: HotelRoomGridProps) => {
  const { hotelRooms, bookings } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(hotelRooms.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHotelRooms = hotelRooms.slice(startIndex, endIndex);

  return (
    <MaxWidthWrapper>
      <div className="w-full grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-y-6 lg:gap-6">
        {currentHotelRooms.map((hotelRoom: HotelRoom, index: number) => {
          const bookingsForRoom = bookings.filter(
            (booking) =>
              booking.room_number === hotelRoom.room_number &&
              booking.hotel_slug === hotelRoom.hotel_slug
          );
          const occupied = bookingsForRoom.some((booking) => {
            const bookedDates = getDatesBetween(
              booking.check_in,
              booking.check_out
            );
            return bookedDates.includes(new Date().toLocaleDateString());
          });

          return (
            <HotelRoomItem
              key={generateID()}
              index={index}
              hotelRoom={hotelRoom}
              occupied={occupied}
            />
          );
        })}
      </div>

      <div className="sm:flex justify-between items-center grid grid-cols-1">
        <div>
          <p className="text-sm sm:py-2 text-center sm:text-left py-4">
            Showing {currentHotelRooms.length} of {hotelRooms.length} results.
          </p>
        </div>
        <div className="flex items-center sm:justify-end justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((oldPage) => Math.max(oldPage - 1, 1))
            }
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((oldPage) => Math.min(oldPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default HotelRoomGrid;
