"use client";
import { Hotel } from "@/lib/hotel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Loader2,
  PlusCircle,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";

import FormWrapper from "../FormWrapper";
import { isEmployeeAtHotel } from "@/lib/user";
import {
  Booking,
  createBooking,
  deleteBooking,
  updateBooking,
} from "@/lib/booking";
import {
  EmployeeBookingValidator,
  TEmployeeBookingValidator,
} from "@/lib/validators/bookingValidator";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, unslugify } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Customer } from "@/lib/customer";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { HotelRoom, getSingleHotelRoom } from "@/lib/hotelRoom";

interface EmployeeBookingFormProps {
  hotels: Hotel[];
  customers: Customer[];
  booking?: Booking;
}
const EmployeeBookingForm = (props: EmployeeBookingFormProps) => {
  const { hotels, customers, booking } = props;
  const {
    booking_id,
    customer_sin,
    hotel_slug,
    room_number,
    check_in_date,
    check_out_date,
  } = booking ?? {};

  const form: UseFormReturn<TEmployeeBookingValidator> =
    useForm<TEmployeeBookingValidator>({
      defaultValues: {
        customer_sin,
        hotel_slug,
        room_number,
        check_in_date,
        check_out_date,
      },
      resolver: zodResolver(EmployeeBookingValidator),
    });

  const { handleSubmit, control } = form;

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const evaluateTotalCost = (
    hotel_room: HotelRoom,
    check_in_date: Date,
    check_out_date: Date
  ): number => {
    const days = Math.ceil(
      (check_out_date.getTime() - check_in_date.getTime()) / (1000 * 3600 * 24)
    );
    return days * hotel_room.price;
  };

  const onSubmit = async (data: TEmployeeBookingValidator) => {
    setIsLoading(true);
    if (await isEmployeeAtHotel(data.hotel_slug)) {
      if (booking) {
        const hotelRoom = await getSingleHotelRoom(
          data.hotel_slug,
          data.room_number
        );
        if (!hotelRoom) {
          toast.error("There is no room with that number in the hotel!");
          setIsLoading(false);
          return;
        }
        const total_cost = evaluateTotalCost(
          hotelRoom,
          data.check_in_date,
          data.check_out_date
        );
        const booking: Booking = { ...data, total_cost };
        let result = await updateBooking(booking);

        if (result) {
          toast.error(result);
        } else {
          toast.success("Booking edited successfully!");
          router.push("/admin/bookings");
          router.refresh();
        }
      } else {
        const hotelRoom = await getSingleHotelRoom(
          data.hotel_slug,
          data.room_number
        );
        if (!hotelRoom) {
          toast.error("There is no room with that number in the hotel!");
          setIsLoading(false);
          return;
        }
        const total_cost = evaluateTotalCost(
          hotelRoom,
          data.check_in_date,
          data.check_out_date
        );
        const booking: Booking = { ...data, total_cost };
        let result = await createBooking(booking);

        if (result) {
          toast.error(result);
        } else {
          toast.success("Booking created successfully!");
          router.push("/admin/bookings");
          router.refresh();
        }
      }
    } else {
      toast.error(
        `You are not authorized to ${
          booking ? "edit" : "create"
        } a booking at this hotel!`
      );
    }
    setIsLoading(false);
  };
  const handleDelete = async () => {
    setIsLoading(true);
    if (await isEmployeeAtHotel(hotel_slug as string)) {
      let result = await deleteBooking(booking_id as string);

      if (result) {
        toast.error(result);
      } else {
        toast.success("Booking deleted successfully!");
        router.push("/admin/bookings");
        router.refresh();
      }
    } else {
      toast.error("You are not authorized to delete a booking at this hotel!");
    }
    setIsLoading(false);
  };
  return (
    <FormWrapper headerText={booking ? "Edit Booking" : "Create Booking"}>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="hotel_slug"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Hotel</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="justify-between font-normal"
                          >
                            {field.value
                              ? `${
                                  hotels.find(
                                    (hotel) => hotel.hotel_slug === field.value
                                  )?.hotel_name
                                } - ${unslugify(
                                  hotels.find(
                                    (hotel) => hotel.hotel_slug === field.value
                                  )?.chain_slug as string
                                )}`
                              : "Select hotel"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[375px]">
                        <Command>
                          <CommandInput placeholder="Search hotels..." />
                          <CommandEmpty>No hotels found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {hotels.map((hotel) => (
                                <CommandItem
                                  value={hotel.hotel_name}
                                  key={hotel.hotel_name}
                                  onSelect={() => {
                                    form.setValue(
                                      "hotel_slug",
                                      hotel.hotel_slug as string
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      hotel.hotel_slug === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {hotel.hotel_name} -{" "}
                                  {unslugify(hotel.chain_slug)}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer_sin"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Customer</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="justify-between font-normal"
                          >
                            {field.value
                              ? `${
                                  customers.find(
                                    (customer) => customer.sin === field.value
                                  )?.sin
                                } - ${
                                  customers.find(
                                    (customer) => customer.sin === field.value
                                  )?.full_name
                                }`
                              : "Select customer"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[375px]">
                        <Command>
                          <CommandInput placeholder="Search customers..." />
                          <CommandEmpty>No customers found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              <CommandItem
                                value="new"
                                key="new"
                                onSelect={() => {
                                  router.push(
                                    "/customers/new?origin=/admin/bookings/new"
                                  );
                                }}
                              >
                                <PlusCircle
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === undefined
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                Create New Customer
                              </CommandItem>
                              {customers.map((customer) => (
                                <CommandItem
                                  value={customer.sin}
                                  key={customer.sin}
                                  onSelect={() => {
                                    form.setValue("customer_sin", customer.sin);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      customer.sin === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {customer.sin} - {customer.full_name}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="room_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input placeholder="101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                            date >= form.getValues("check_out_date")
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
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date <= form.getValues("check_in_date") ||
                            date > new Date("2030-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2 py-4">
                <Button disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader2 className="animate-spin mr-3" />
                      <span>Loading</span>
                    </div>
                  ) : (
                    <p>Submit</p>
                  )}
                </Button>
                {booking && (
                  <Button
                    type="button"
                    onClick={() => handleDelete()}
                    disabled={isLoading}
                    variant="destructive"
                  >
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <Loader2 className="animate-spin mr-3" />
                        <span>Loading</span>
                      </div>
                    ) : (
                      <p>Delete booking</p>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </FormWrapper>
  );
};

export default EmployeeBookingForm;
