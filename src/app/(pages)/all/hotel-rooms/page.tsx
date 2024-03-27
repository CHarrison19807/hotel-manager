import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAllHotelRooms } from "@/lib/hotelRoom";
import { getAllHotelChains } from "@/lib/hotelChain";
import HotelRoomFilterGridWrapper from "@/components/HotelRooms/HotelRoomFilterGridWrapper";
import { getAllHotels } from "@/lib/hotel";
import { getAllBookings } from "@/lib/booking";

const AllHotelRoomsPage = async () => {
  const hotelRooms = await getAllHotelRooms();
  const hotelChains = await getAllHotelChains();
  const hotels = await getAllHotels();
  const bookings = await getAllBookings();

  return (
    <MaxWidthWrapper>
      <h1 className="text-4xl font-bold my-10 text-center">All Hotel Rooms</h1>
      <HotelRoomFilterGridWrapper
        hotelChains={hotelChains}
        hotels={hotels}
        bookings={bookings}
        hotelRooms={hotelRooms}
      />
    </MaxWidthWrapper>
  );
};

export default AllHotelRoomsPage;
