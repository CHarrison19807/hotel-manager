import { z } from "zod";
import { formatSIN } from "../utils";

const EmployeeValidate = z.object({
  full_name: z
    .string()
    .min(1, { message: "Full name can not be empty!" })
    .max(32, { message: "Full name can not be longer than 32 characters!" }),
  address: z.string().min(1, { message: "Address can not be empty!" }),
  role: z.enum(["manager", "regular"]),
  hotel_slug: z.string(),
  sin: z.string().superRefine((data, ctx) => {
    if (formatSIN(data).length != 11 || formatSIN(data) === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid SIN!",
      });
    }
  }),
});

export default EmployeeValidate;

export type TEmployeeValidate = z.infer<typeof EmployeeValidate>;
