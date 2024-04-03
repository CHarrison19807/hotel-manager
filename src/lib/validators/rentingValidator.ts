import { z } from "zod";

export const rentingValidator = z.object({
  cardNumber: z.string().length(16, { message: "Enter a valid card number!" }),
  expirationDate: z
    .string()
    .length(5, { message: "Enter a valid expiration date!" }),
  cvv: z.string().length(3, { message: "Enter a valid cvv!" }),
});

export type TRentingValidator = z.infer<typeof rentingValidator>;
