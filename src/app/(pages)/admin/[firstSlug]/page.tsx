import BookingRentingForm from "@/components/Bookings/BookingRentingForm";
import HotelChainForm from "@/components/HotelChains/HotelChainForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getBooking } from "@/lib/booking";
import { getSingleHotelChain } from "@/lib/hotelChain";
import { notFound } from "next/navigation";

interface EditHotelChainProps {
  params: {
    firstSlug: string;
  };
}

const FirstSlugPage = async ({ params }: EditHotelChainProps) => {
  const { firstSlug } = params;
  const isFirstSlugNumeric = /^\d+$/.test(firstSlug);

  if (isFirstSlugNumeric) {
    const booking = await getBooking(firstSlug);
    return (
      <MaxWidthWrapper>
        <BookingRentingForm booking={booking} />
      </MaxWidthWrapper>
    );
  } else {
    const hotelChain = await getSingleHotelChain(firstSlug);

    if (!hotelChain) {
      notFound();
    }

    return (
      <MaxWidthWrapper>
        <HotelChainForm hotelChain={hotelChain} />
      </MaxWidthWrapper>
    );
  }
};

export default FirstSlugPage;
