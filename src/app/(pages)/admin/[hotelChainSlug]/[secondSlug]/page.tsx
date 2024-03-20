import HotelRoomForm from "@/components/HotelRooms/HotelRoomForm";
import HotelForm from "@/components/Hotels/HotelForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAllHotels, getSingleHotel } from "@/lib/hotel";
import { getAllHotelChains, getSingleHotelChain } from "@/lib/hotelChain";
import { getSingleHotelRoom } from "@/lib/hotelRoom";
import { notFound } from "next/navigation";

interface EditHotelProps {
  params: {
    hotelChainSlug: string;
    secondSlug: string;
  };
}

const EditHotelOrHotelRoomPage = async ({ params }: EditHotelProps) => {
  const { hotelChainSlug, secondSlug } = params;
  const isSecondSlugNumeric = /^\d+$/.test(secondSlug);
  if (isSecondSlugNumeric) {
    const hotels = await getAllHotels();
    const hotelRoom = await getSingleHotelRoom(
      hotelChainSlug,
      parseInt(secondSlug)
    );

    if (!hotelRoom) {
      notFound();
    }

    return (
      <MaxWidthWrapper>
        <HotelRoomForm hotels={hotels} hotelRoom={hotelRoom} />
      </MaxWidthWrapper>
    );
  } else {
    const hotelChains = await getAllHotelChains();
    const hotel = await getSingleHotel(secondSlug);

    if (!hotel) {
      notFound();
    }

    return (
      <MaxWidthWrapper>
        <HotelForm hotelChains={hotelChains} hotel={hotel} />
      </MaxWidthWrapper>
    );
  }
};

export default EditHotelOrHotelRoomPage;
