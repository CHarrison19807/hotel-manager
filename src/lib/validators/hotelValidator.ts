import { z } from "zod";
import { formatPhoneNumber } from "../utils";

export const hotelValidate = z
  .object({
    hotel_name: z
      .string()
      .min(1, { message: "Hotel name can not be empty!" })
      .max(16, {
        message: "Hotel name can not be longer than 16 characters!",
      }),
    phone_numbers: z.array(
      z.string().min(10, { message: "Enter a valid phone number!" })
    ),
    email_addresses: z.array(z.string().email()),
    address: z
      .string()
      .min(1, { message: "Address can not be empty!" })
      .max(24, {
        message: "Address can not be longer than 24 characters!",
      }),
  })
  .superRefine((data, ctx) => {
    const phone_numbers = data.phone_numbers;
    const email_addresses = data.email_addresses;
    email_addresses.map((email, index) => {
      for (let i = 0; i < email_addresses.length; i++) {
        if (i === index) {
          continue;
        }
        if (email === email_addresses[i]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Can not have duplicate email addresses!",
            path: ["email_addresses", i],
          });
        }
      }
    });

    phone_numbers.map((phone, index) => {
      for (let i = 0; i < phone_numbers.length; i++) {
        if (i === index) {
          continue;
        }
        if (
          formatPhoneNumber(phone)?.length != 14 ||
          formatPhoneNumber(phone) === null
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter a valid phone number!",
            path: ["phone_numbers", index],
          });
        }
        if (phone === phone_numbers[i]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Can not have duplicate phone numbers!",
            path: ["phone_numbers", i],
          });
        }
      }
    });
  });

export type THotelValidate = z.infer<typeof hotelValidate>;
