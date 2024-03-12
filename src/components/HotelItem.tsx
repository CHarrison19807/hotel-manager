"use client";

import { useEmployeeContext } from "@/contexts/EmployeeContext";
import { formatPhoneNumber, hotel } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import Rating from "@mui/material/Rating";
import slugify from "slugify";

const HotelItem = ({ hotel }: { hotel: hotel }) => {
  console.log(hotel);
  const {
    hotel_name,
    chain_slug,
    phone_numbers,
    email_addresses,
    address,
    rating,
    number_rooms,
  } = hotel;
  const { isEmployee } = useEmployeeContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (isVisible && hotel) {
    return (
      <Card className="sm:w-full md:mx-0 mx-auto max-w-[450px] md:max-w-none w-[375px]">
        <>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>{hotel_name}</CardTitle>
              <Rating name="read-only" value={rating} readOnly />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <p>{address}</p>
              <p>{number_rooms} Rooms</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div>Email addresses</div>
                <ul>
                  {email_addresses.map((email) => (
                    <li
                      className="text-muted-foreground text-sm pb-1"
                      key={email}
                    >
                      {email}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col text-right gap-1 shrink-0">
                <p>Phone numbers</p>
                <ul>
                  {phone_numbers.map((phone) => (
                    <li
                      className="text-muted-foreground text-sm pb-1"
                      key={phone}
                    >
                      {formatPhoneNumber(phone)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </>

        <CardFooter className="flex justify-between">
          {isEmployee && (
            <>
              <Button asChild variant="outline">
                <Link
                  href={
                    "/" +
                    chain_slug +
                    "/" +
                    slugify(hotel_name, { lower: true }) +
                    "/edit"
                  }
                >
                  Edit Hotel
                </Link>
              </Button>
              <Button asChild>
                <Link
                  href={
                    "/" +
                    chain_slug +
                    "/" +
                    slugify(hotel_name, { lower: true })
                  }
                >
                  View Rooms
                </Link>
              </Button>
            </>
          )}
          {!isEmployee && (
            <Button asChild className="w-full">
              <Link
                href={
                  "/" + chain_slug + "/" + slugify(hotel_name, { lower: true })
                }
              >
                View Rooms
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  } else {
    return <HotelPlaceholder />;
  }
};

const HotelPlaceholder = () => {
  return (
    <Card className="w-[400px]">
      <div className=" flex flex-col gap-1 p-5">
        <Skeleton className="h-8 w-3/5" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-1/4" />
        </div>

        <div className="flex justify-between gap-2 w-full py-6">
          <div className="flex flex-col gap-2 w-2/5">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex flex-col gap-2 w-1/3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full" />
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

export default HotelItem;
