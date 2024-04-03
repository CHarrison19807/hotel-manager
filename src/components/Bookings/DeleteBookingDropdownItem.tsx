"use client";

import { Booking, deleteBooking } from "@/lib/booking";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { isEmployeeAtHotel } from "@/lib/user";

const DeleteBookingDropdownItem = ({ booking }: { booking: Booking }) => {
  const router = useRouter();

  return (
    <DropdownMenuItem
      onClick={async () => {
        if (
          !booking.is_renting ||
          (await isEmployeeAtHotel(booking.hotel_slug))
        ) {
          const result = await deleteBooking(booking.booking_id as string);
          if (result) {
            toast.error(result);
          } else {
            toast.success("Booking deleted successfully!");
            router.refresh();
          }
        } else {
          toast.error("You do not have permission to delete this booking.");
        }
      }}
    >
      Delete booking
    </DropdownMenuItem>
  );
};
export default DeleteBookingDropdownItem;
