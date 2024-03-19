import { z } from "zod";
import { formatPhoneNumber } from "../utils";

export const HotelChainValidate = z
  .object({
    chain_name: z
      .string()
      .min(1, { message: "Hotel chain name can not be empty!" })
      .max(16, {
        message: "Hotel chain name can not be longer than 16 characters!",
      }),
    phone_numbers: z.array(z.string()),
    email_addresses: z.array(
      z.string().email({ message: "Enter a valid email address!" })
    ),
    central_address: z
      .string()
      .min(1, { message: "Central address can not be empty!" })
      .max(24, {
        message: "Central address can not be longer than 24 characters!",
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
        if (email.toLowerCase() === email_addresses[i].toLowerCase()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Can not have duplicate email addresses!",
            path: ["email_addresses", i],
          });
        }
      }
      phone_numbers.map((phone: any, index: number) => {
        for (let i = 0; i < phone_numbers.length; i++) {
          const formattedPhone = formatPhoneNumber(phone);
          if (formattedPhone?.length != 14 || formattedPhone === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Enter a valid phone number!",
              path: ["phone_numbers", index],
            });
          }

          if (
            formattedPhone === formatPhoneNumber(phone_numbers[i]) &&
            i !== index
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Can not have duplicate phone numbers!",
              path: ["phone_numbers", i],
            });
          }
        }
      });
    });
  });

export type THotelChainValidate = z.infer<typeof HotelChainValidate>;
