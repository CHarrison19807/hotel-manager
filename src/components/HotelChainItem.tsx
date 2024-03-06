"use client";

import { formatPhoneNumber, hotel_chain } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEmployeeContext } from "@/contexts/EmployeeContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

const HotelChainItem = ({ hotelChain }: { hotelChain: hotel_chain }) => {
  const { isEmployee } = useEmployeeContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const {
    chain_name,
    central_address,
    phone_numbers,
    email_addresses,
    number_hotels,
  } = hotelChain;
  // TODO: VERTICAL DISPLAY OF PHONE NUMBERS AND EMAILS ON MOBILE
  if (isVisible && hotelChain) {
    return (
      <Card className="sm:w-full md:mx-0 mx-auto max-w-[450px] md:max-w-none w-[375px]">
        <>
          <CardHeader>
            <CardTitle>{chain_name}</CardTitle>
            <div className="flex justify-between text-sm text-muted-foreground">
              <p>{central_address}</p>
              <p>{number_hotels} Hotels</p>
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
                <Link href={"/" + chain_name + "/edit"}>Edit Chain</Link>
              </Button>
              <Button asChild>
                <Link href={"/" + chain_name}>View Hotels</Link>
              </Button>
            </>
          )}
          {!isEmployee && (
            <Button asChild className="w-full">
              <Link href={"/" + chain_name}>View Hotels</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  } else {
    return <HotelChainPlaceholder />;
  }
};

export default HotelChainItem;

function HotelChainPlaceholder() {
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
}
