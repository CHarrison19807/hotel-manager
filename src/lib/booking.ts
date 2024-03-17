"use server";

export type Booking = {
  booking_id: string;
  customer_id: string;
  hotel_slug: string;
  room_number: string;
  check_in_date: string;
  check_out_date: string;
  total_cost: number;
};
