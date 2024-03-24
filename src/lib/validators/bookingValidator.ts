import { z } from "zod";

export const EmployeeBookingValidator = z
  .object({
    customer_sin: z.string().min(1, "Select a customer!"),
    hotel_slug: z.string().min(1, "Select a hotel!"),
    room_number: z.coerce
      .number({ invalid_type_error: "Enter a valid room number!" })
      .int("Enter a valid room number!")
      .min(1, "Enter a valid room number!"),
    check_in: z.date(),
    check_out: z.date(),
  })
  .refine((data) => {
    if (data.check_in > data.check_out) {
      throw new Error("Check in date must be before check out date!");
    }
    return true;
  });

export const CustomerBookingValidator = z
  .object({
    check_in: z.date(),
    check_out: z.date(),
  })
  .refine((data) => {
    if (data.check_in > data.check_out) {
      throw new Error("Check in date must be before check out date!");
    }
    return true;
  });

export type TEmployeeBookingValidator = z.infer<
  typeof EmployeeBookingValidator
>;

export type TCustomerBookingValidator = z.infer<
  typeof CustomerBookingValidator
>;
