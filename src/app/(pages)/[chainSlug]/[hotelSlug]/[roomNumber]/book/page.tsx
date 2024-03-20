import CustomerBookingForm from "@/components/Bookings/CustomerBookingForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { BookedDates, getBookedDates, getBooking } from "@/lib/booking";
import { getSingleHotelRoom } from "@/lib/hotelRoom";
import { getServerSideUser } from "@/lib/user";
import { notFound } from "next/navigation";

interface CustomerBookingPageProps {
  params: {
    chainSlug: string;
    hotelSlug: string;
    roomNumber: number;
  };
}

const CustomerBookingPage = async (props: CustomerBookingPageProps) => {
  const { chainSlug, hotelSlug, roomNumber } = props.params;
  const bookingDates = await getBookedDates(roomNumber, hotelSlug);
  const hotelRoom = await getSingleHotelRoom(hotelSlug, roomNumber);
  const user = await getServerSideUser();
  if (!hotelRoom) {
    notFound();
  }
  return (
    <MaxWidthWrapper>
      <CustomerBookingForm
        hotelRoom={hotelRoom}
        user={user}
        chainSlug={chainSlug}
        bookingDates={bookingDates}
      />
    </MaxWidthWrapper>
  );
};

export default CustomerBookingPage;
