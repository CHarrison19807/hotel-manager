import HotelForm from "@/components/HotelForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getSingleHotel } from "@/lib/hotel";
import { hotel, hotel_chain } from "@/lib/utils";
import { notFound } from "next/navigation";

interface HotelProps {
  params: {
    hotelChainNameSlug: string;
    hotelNameSlug: string;
  };
}
const EditHotelPage = async ({ params }: HotelProps) => {
  const { hotelChainNameSlug, hotelNameSlug } = params;
  const hotel = await getSingleHotel(hotelNameSlug, hotelChainNameSlug);
  console.log(hotel);
  if (!hotel) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <HotelForm
        props={{
          usage: "edit",
          headerText: `Edit the ${hotel.hotel_name} Hotel`,
          submitText: "Edit Hotel Chain",
          hotel: hotel as hotel,
        }}
      />
    </MaxWidthWrapper>
  );
};
export default EditHotelPage;
