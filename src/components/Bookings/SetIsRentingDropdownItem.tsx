"use client";

import { Booking, updateBooking } from "@/lib/booking";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";

const SetIsRentingDropdownItem = ({ booking }: { booking: Booking }) => {
  const router = useRouter();

  return (
    <DropdownMenuItem
      onClick={async () => {
        if (booking.is_renting) {
          const updatedBooking = {
            ...booking,
            is_renting: !booking.is_renting,
          };
          const result = await updateBooking(updatedBooking);
          if (result) {
            toast.error(
              "Unexpected error occurred while updating booking. Please try again."
            );
          } else {
            toast.success("Booking updated successfully!");
            router.refresh();
          }
        } else {
          router.push(`/admin/${booking.booking_id}`);
        }
      }}
    >
      {booking.is_renting ? "Cancel renting" : "Create renting"}
    </DropdownMenuItem>
  );
};
export default SetIsRentingDropdownItem;
