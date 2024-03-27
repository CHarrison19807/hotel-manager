import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAllHotelRooms } from "@/lib/hotelRoom";
import HotelRoomGrid from "@/components/HotelRooms/HotelRoomGrid";

const AllHotelRoomsPage = async () => {
  const hotelRooms = await getAllHotelRooms();
  return (
    <MaxWidthWrapper>
      <h1 className="text-4xl font-bold my-10 text-center">All Hotel Rooms</h1>
      <HotelRoomGrid hotelRooms={hotelRooms} />
    </MaxWidthWrapper>
  );
};

export default AllHotelRoomsPage;
