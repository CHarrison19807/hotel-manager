import { z } from "zod";

const CustomerValidator = z.object({
  full_name: z
    .string()
    .min(1, { message: "Full name can not be empty!" })
    .max(32, { message: "Full name can not be longer than 32 characters!" }),
  address: z
    .string()
    .min(1, { message: "Address can not be empty!" })
    .max(32, { message: "Address can not be longer than 32 characters!" }),
});

export type TCustomerValidator = z.infer<typeof CustomerValidator>;
