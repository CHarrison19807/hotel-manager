import CreateNew from "@/components/CreateNewItem";
import HotelRoomItem from "@/components/HotelRoomItem";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getChainHotels, getSingleHotel } from "@/lib/hotel";
import { getSingleHotelChain } from "@/lib/hotelChain";
import { getHotelRooms } from "@/lib/hotelRoom";
import { HotelRoom } from "@/lib/utils";
import { notFound } from "next/navigation";

interface HotelProps {
  params: {
    hotelNameSlug: string;
    hotelChainNameSlug: string;
  };
}
const HotelPage = async ({ params }: HotelProps) => {
  const { hotelNameSlug, hotelChainNameSlug } = params;
  const rooms = await getHotelRooms(hotelNameSlug);
  const hotel = await getSingleHotel(hotelNameSlug, hotelChainNameSlug);

  if (!rooms || !hotel) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <div className="w-full max-w-screen-xl mx-auto flex items-center flex-col px-5 md:px-0">
        <h1 className="text-4xl font-bold my-10">
          All Hotel Rooms in {hotel.hotel_name}
        </h1>
        <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-6 lg:gap-6  ">
          <CreateNew
            href={`/${hotelChainNameSlug}/${hotelNameSlug}/new`}
            cta={`Create a New Room in ${hotel.hotel_name}`}
            description="Click the button above to create a new room!"
          />
          {rooms.map((room: hotel_room) => (
            <HotelRoomItem key={room.room_number} room={room} />
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default HotelPage;
