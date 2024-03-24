import { z } from "zod";

export const HotelRoomValidator = z
  .object({
    room_number: z.coerce
      .number({ invalid_type_error: "Enter a valid room number!" })
      .int("Enter a valid room number!")
      .min(1, "Enter a valid room number!"),
    hotel_slug: z.string().min(1, { message: "Select a hotel!" }),
    price: z.coerce
      .number({ invalid_type_error: "Enter a price!" })
      .int("Enter a price!")
      .min(1, "Enter a price!"),
    damages: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    extended: z.boolean(),
    capacity: z.enum(["single", "double", "suite"]),
    view: z.enum(["garden", "ocean", "city", "mountain", "pool"]),
  })
  .superRefine((data, ctx) => {
    console.log(data);
    const { damages, amenities } = data;
    if (damages) {
      damages.map((damage, index) => {
        for (let i = 0; i < damages.length; i++) {
          if (damage === damages[i] && i !== index) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Can not have duplicate damages!",
              path: ["damages", i],
            });
          }
        }
        if (damages[index] === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Select a damage!",
            path: ["damages", index],
          });
        }
      });
    }

    if (amenities) {
      amenities.map((amenity, index) => {
        for (let i = 0; i < amenities.length; i++) {
          if (amenity === amenities[i] && i !== index) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Can not have duplicate amenities!",
              path: ["amenities", i],
            });
          }
        }
        console.log(amenities[index]);
        if (amenities[index] === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Select an amenity!",
            path: ["amenities", index],
          });
        }
      });
    }
  });

export type THotelRoomValidator = z.infer<typeof HotelRoomValidator>;
