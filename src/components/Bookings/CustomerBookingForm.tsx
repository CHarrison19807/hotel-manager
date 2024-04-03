"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";

import { User } from "@/lib/user";
import { BookedDates, createBooking } from "@/lib/booking";
import {
  CustomerBookingValidator,
  TCustomerBookingValidator,
} from "@/lib/validators/bookingValidator";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, formatPrice } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { HotelRoom } from "@/lib/hotelRoom";

interface CustomerBookingFormProps {
  hotelRoom: HotelRoom;
  user: User;
  bookingDates: BookedDates[];
}
const CustomerBookingForm = (props: CustomerBookingFormProps) => {
  const { hotelRoom, user, bookingDates } = props;
  const { hotel_slug, room_number, price } = hotelRoom;
  const [totalCost, setTotalCost] = useState(0);

  let bookedDates: number[] = bookingDates
    .map((dates) => {
      const { check_in: checkInDate, check_out: checkOutDate } = dates;
      const datesArray = [];
      let currentDate: Date = checkInDate;
      while (currentDate <= checkOutDate) {
        datesArray.push(currentDate.getTime());
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      }
      return datesArray;
    })
    .flat()
    .filter((self, index, array) => array.indexOf(self) === index);

  const form: UseFormReturn<TCustomerBookingValidator> =
    useForm<TCustomerBookingValidator>({
      resolver: zodResolver(CustomerBookingValidator),
    });

  const { handleSubmit } = form;

  const [isLoading, setIsLoading] = useState(false);

  const evaluateTotalCost = useCallback(
    (checkInDate: Date, checkOutDate: Date): number => {
      if (!checkInDate || !checkOutDate) {
        return 0;
      }
      const days = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24)
      );
      return days * price;
    },
    [price]
  );

  const formCheckInDate = form.watch("check_in");
  const formCheckOutDate = form.watch("check_out");

  useEffect(() => {
    setTotalCost(evaluateTotalCost(formCheckInDate, formCheckOutDate));
  }, [formCheckInDate, formCheckOutDate, evaluateTotalCost]);

  const router = useRouter();

  const onSubmit = async (data: TCustomerBookingValidator) => {
    setIsLoading(true);
    if (!user) {
      router.push(`/customers?origin=/${hotel_slug}/${room_number}`);
      toast.error("You must be logged in to book a room!");
      setIsLoading(false);
      return;
    }
    const newBooking = {
      ...data,
      hotel_slug: hotel_slug,
      room_number: room_number,
      total_cost: totalCost,
      customer_sin: user?.sin as string,
    };
    const result = await createBooking(newBooking);
    if (result) {
      toast.error(result);
    } else {
      toast.success("Booking created!");
      router.push("/");
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-around">
          <FormField
            control={form.control}
            name="check_in"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Check in date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[375px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick your check in date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() ||
                        date >= form.getValues("check_out") ||
                        bookedDates.includes(date.getTime())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Check in time starts at 4:00 pm
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="check_out"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Check out date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[375px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick your check out date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date <= form.getValues("check_in") ||
                        date > new Date("2030-01-01") ||
                        date < new Date() ||
                        bookedDates.includes(date.getTime())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Check out time ends at 10:00 am
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">Total cost</p>
            {/* <Input value={formatPrice(totalCost)}></Input>
            flex h-10 w-full rounded-md border border-input bg-background px-3
            py-2 text-sm ring-offset-background file:border-0
            file:bg-transparent file:text-sm file:font-medium
            placeholder:text-muted-foreground focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-ring
            focus-visible:ring-offset-2 disabled:cursor-not-allowed
            disabled:opacity-50 */}
            <p className="font-bold py-2">{formatPrice(totalCost)}</p>
            <p className="text-sm text-muted-foreground">
              {totalCost === 0 ? (
                <span>Choose your dates to calculate the total cost</span>
              ) : (
                <span>
                  The total cost for your stay is {formatPrice(totalCost)} CAD
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 py-4">
          <Button disabled={isLoading}>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="animate-spin mr-3" />
                <span>Loading</span>
              </div>
            ) : totalCost === 0 ? (
              <p>Book</p>
            ) : (
              <p>Book for {formatPrice(totalCost)}</p>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerBookingForm;
