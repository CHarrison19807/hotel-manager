"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
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
import {
  TRentingValidator,
  rentingValidator,
} from "@/lib/validators/rentingValidator";

import { Booking, updateBooking } from "@/lib/booking";

const BookingRentingForm = ({ booking }: { booking: Booking }) => {
  const form = useForm<TRentingValidator>({
    resolver: zodResolver(rentingValidator),
  });

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (data: TRentingValidator) => {
    setIsLoading(true);
    const updatedBooking = { ...booking, is_renting: true };
    const result = await updateBooking(updatedBooking);
    if (result) {
      toast.error(result);
    } else {
      toast.success("Booking updated successfully!");
      router.push(`/admin/bookings/`);
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <FormWrapper headerText="Enter Payment Details">
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date</FormLabel>
                    <FormControl>
                      <Input placeholder="1/2/25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567891011" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3 pt-4">
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
              </div>
            </div>
          </form>
        </Form>
      </div>
    </FormWrapper>
  );
};

export default BookingRentingForm;
