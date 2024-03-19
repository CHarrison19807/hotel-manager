import { z } from "zod";
import { formatSIN } from "../utils";

export const CustomerValidator = z.object({
  full_name: z
    .string()
    .min(1, { message: "Full name can not be empty!" })
    .max(32, { message: "Full name can not be longer than 32 characters!" }),
  address: z
    .string()
    .min(1, { message: "Address can not be empty!" })
    .max(32, { message: "Address can not be longer than 32 characters!" }),
  sin: z.string().superRefine((data, ctx) => {
    if (formatSIN(data).length != 11 || formatSIN(data) === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid SIN!",
      });
    }
  }),
});

export type TCustomerValidator = z.infer<typeof CustomerValidator>;
