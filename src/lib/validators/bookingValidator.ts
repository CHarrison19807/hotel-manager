import { z } from "zod";

const BookingValidator = z
  .object({
    check_in_date: z.date(),
    check_out_date: z.date(),
  })
  .superRefine((data, ctx) => {
    if (data.check_in_date > data.check_out_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Check-in date must be before check-out date!",
        path: ["check_in_date", "check_out_date"],
      });
    }
  });

export type TBookingValidator = z.infer<typeof BookingValidator>;
