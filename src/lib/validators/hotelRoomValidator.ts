import { z } from "zod";

const HotelRoomValidator = z.object({
  room_number: z
    .number()
    .int({ message: "Room number must be a positive integer!" })
    .positive({ message: "Room number must be a positive integer!" }),
  hotel_slug: z.string().min(1, { message: "Select a hotel!" }),
  price: z.number().positive({ message: "Price must be a positive number!" }),
  damages: z.array(z.string()),
  amenities: z.array(z.string()),
  extended: z.boolean(),
  capacity: z.enum(["single", "double", "suite"]),
});

export type THotelRoomValidator = z.infer<typeof HotelRoomValidator>;
