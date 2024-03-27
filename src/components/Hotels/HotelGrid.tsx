"use client";

import MaxWidthWrapper from "../MaxWidthWrapper";
import { Hotel } from "@/lib/hotel";
import HotelItem from "./HotelItem";
import { Button } from "../ui/button";
import { useState } from "react";

interface HotelGridProps {
  hotels: Hotel[];
}

const ITEMS_PER_PAGE = 12;

const HotelGrid = (props: HotelGridProps) => {
  const { hotels } = props;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(hotels.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHotels = hotels.slice(startIndex, endIndex);
  return (
    <MaxWidthWrapper>
      <div className="w-full grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-y-6 lg:gap-6">
        {currentHotels.map((hotel: Hotel, index: number) => {
          return (
            <HotelItem key={hotel.hotel_slug} index={index} hotel={hotel} />
          );
        })}
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm py-2">
            Showing {currentHotels.length} of {hotels.length} results.
          </p>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
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

export default HotelGrid;
