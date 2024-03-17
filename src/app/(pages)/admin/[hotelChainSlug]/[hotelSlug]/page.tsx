import HotelForm from "@/components/Hotels/HotelForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getSingleHotel } from "@/lib/hotel";
import { getAllHotelChains, getSingleHotelChain } from "@/lib/hotelChain";
import { notFound } from "next/navigation";

interface EditHotelProps {
  params: {
    hotelChainSlug: string;
    hotelSlug: string;
  };
}

const EditHotelPage = async ({ params }: EditHotelProps) => {
  const { hotelChainSlug, hotelSlug } = params;
  const hotel = await getSingleHotel(hotelSlug, hotelChainSlug);
  const hotelChains = await getAllHotelChains();

  if (!hotel) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <HotelForm
        headerText={`Edit ${hotel.hotel_name}`}
        submitText="Save Hotel Chain"
        usage="edit"
        hotelChains={hotelChains}
        hotel={hotel}
      />
    </MaxWidthWrapper>
  );
};

export default EditHotelPage;
