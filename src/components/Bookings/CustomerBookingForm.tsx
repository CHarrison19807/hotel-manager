"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { Input } from "../ui/input";
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

import FormWrapper from "../FormWrapper";
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
  chainSlug: string;
  hotelRoom: HotelRoom;
  user: User;
  bookingDates: BookedDates[];
}
const CustomerBookingForm = (props: CustomerBookingFormProps) => {
  const { hotelRoom, user, chainSlug, bookingDates } = props;
  const { hotelSlug, roomNumber, price } = hotelRoom;
  const [totalCost, setTotalCost] = useState(0);

  let bookedDates: number[] = bookingDates
    .map((dates) => {
      const { check_in_date: checkInDate, check_out_date: checkOutDate } =
        dates;
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

  const formCheckInDate = form.watch("check_in_date");
  const formCheckOutDate = form.watch("check_out_date");

  useEffect(() => {
    setTotalCost(evaluateTotalCost(formCheckInDate, formCheckOutDate));
  }, [formCheckInDate, formCheckOutDate, evaluateTotalCost]);

  const router = useRouter();

  const onSubmit = async (data: TCustomerBookingValidator) => {
    setIsLoading(true);
    if (!user) {
      router.push(
        `/customers?origin=${chainSlug}/${hotelSlug}/${roomNumber}/book`
      );
      toast.error("You must be logged in to book a room!");
      setIsLoading(false);
      return;
    }
    const newBooking = {
      ...data,
      hotel_slug: hotelSlug,
      room_number: roomNumber,
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
    <FormWrapper headerText={`Book room ${roomNumber}`}>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="check_in_date"
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
                            date >= form.getValues("check_out_date") ||
                            bookedDates.includes(date.getTime())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="check_out_date"
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
                          onDayClick={(date) =>
                            console.log(bookedDates.includes(date.getTime()))
                          }
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date <= form.getValues("check_in_date") ||
                            date > new Date("2030-01-01") ||
                            date < new Date() ||
                            bookedDates.includes(date.getTime())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Total cost</FormLabel>
                <Input value={formatPrice(totalCost)} readOnly />
                <FormDescription>
                  {totalCost === 0 ? (
                    <span>Choose your dates to calculate the total cost</span>
                  ) : (
                    <span>
                      The total cost for your stay is {formatPrice(totalCost)}{" "}
                      CAD
                    </span>
                  )}
                </FormDescription>
              </FormItem>

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
            </div>
          </form>
        </Form>
      </div>
    </FormWrapper>
  );
};

export default CustomerBookingForm;
