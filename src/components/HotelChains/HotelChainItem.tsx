"use client";

import { HotelChain } from "@/lib/hotelChain";
import { formatPhoneNumber } from "@/lib/utils";
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
import slugify from "slugify";

interface HotelChainItemProps {
  hotelChain: HotelChain;
  index: number;
}

const HotelChainItem = (props: HotelChainItemProps) => {
  const { index, hotelChain } = props;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  const {
    chain_name,
    central_address,
    phone_numbers,
    email_addresses,
    number_hotels,
  } = hotelChain;
  if (isVisible && hotelChain) {
    return (
      <Card className="sm:w-full md:mx-0 mx-auto max-w-[450px] md:max-w-none w-[325px] flex-col flex">
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

        <CardFooter className="flex justify-between mt-auto">
          <Button asChild className="w-full">
            <Link href={"/" + slugify(chain_name, { lower: true })}>
              View Hotels
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  } else {
    return <HotelChainPlaceholder />;
  }
};

export default HotelChainItem;

const HotelChainPlaceholder = () => {
  return (
    <Card className="sm:w-full md:mx-0 mx-auto max-w-[450px] md:max-w-none w-[325px]">
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
