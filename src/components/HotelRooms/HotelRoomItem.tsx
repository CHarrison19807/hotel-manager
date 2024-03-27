"use client";

import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import Status from "../Status";
import { HotelRoom } from "@/lib/hotelRoom";

interface HotelRoomItemProps {
  hotelRoom: HotelRoom;
  index: number;
}

const HotelRoomItem = (props: HotelRoomItemProps) => {
  const { hotelRoom, index } = props;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  const {
    room_number,
    hotel_slug,
    price,
    occupied,
    amenities,
    damages,
    capacity,
  } = hotelRoom;
  const viewRoomLink = `/${hotel_slug}/${room_number.toString()}`;

  if (isVisible && hotelRoom) {
    return (
      <Card className="sm:w-full md:mx-0 mx-auto md:max-w-none min-w-[375px] max-w-[450px]">
        <>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                <p>Room {room_number}</p>
              </CardTitle>
              <Status
                goodText="Vacant"
                badText="Occupied"
                status={occupied as boolean}
                desired={false}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <p className="text-card-foreground capitalize font-medium">
                  {capacity}
                </p>
                <p className="text-lg font-bold">
                  {formatPrice(price)} / night
                </p>
              </div>
              <div className="flex flex-col text-muted-foreground gap-1 capitalize">
                <p>
                  {amenities?.length === 0
                    ? "No amenities"
                    : amenities?.length +
                      (amenities?.length === 1 ? " amenity" : " amenities")}
                </p>
                <p>
                  {damages?.length === 0
                    ? "No damages"
                    : damages?.length +
                      (damages?.length === 1 ? " damage" : " damages")}
                </p>
              </div>
            </div>
          </CardContent>
        </>

        <CardFooter className="flex justify-between">
          <Button asChild className="w-full">
            <Link href={viewRoomLink}>View Room</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  } else {
    return <HotelChainPlaceholder />;
  }
};

export default HotelRoomItem;

const HotelChainPlaceholder = () => {
  return (
    <Card className="sm:w-full md:mx-0 mx-auto md:max-w-none min-w-[375px] max-w-[450px] h-[226px]">
      <div className=" flex flex-col gap-1 p-5">
        <div className="flex justify-between pt-1">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-8 w-1/4" />
        </div>

        <div className="flex justify-between gap-2 w-full py-6">
          <div className="flex flex-col gap-2 w-2/5">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex flex-col gap-2 w-1/3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div>
          <Skeleton className="h-10 w-auto px-6" />
        </div>
      </div>
    </Card>
  );
};
