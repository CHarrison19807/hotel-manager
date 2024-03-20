import HotelRoomItem from "@/components/HotelRoomItem";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getSingleHotel } from "@/lib/hotel";
import { HotelRoom, getHotelRooms } from "@/lib/hotelRoom";
import { notFound } from "next/navigation";

interface HotelProps {
  params: {
    hotelSlug: string;
    chainSlug: string;
  };
}
const HotelPage = async ({ params }: HotelProps) => {
  const { hotelSlug, chainSlug } = params;
  const rooms = await getHotelRooms(hotelSlug);
  const hotel = await getSingleHotel(hotelSlug);
  console.log(rooms, hotel);
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
          {rooms.map((room: HotelRoom) => (
            <HotelRoomItem
              key={room.roomNumber}
              room={room}
              chainSlug={chainSlug}
            />
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default HotelPage;
