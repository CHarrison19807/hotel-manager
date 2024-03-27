import HotelRoomGrid from "@/components/HotelRooms/HotelRoomGrid";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getSingleHotel } from "@/lib/hotel";
import { getHotelRooms } from "@/lib/hotelRoom";
import { notFound } from "next/navigation";
import CustomerBookingForm from "@/components/Bookings/CustomerBookingForm";
import { getAllBookings, getBookedDates } from "@/lib/booking";
import { getSingleHotelRoom } from "@/lib/hotelRoom";
import { getServerSideUser } from "@/lib/user";
import { getAllHotelChains } from "@/lib/hotelChain";

interface HotelProps {
  params: {
    firstSlug: string;
    secondSlug: string;
  };
}
const CustomerSecondSlugPage = async ({ params }: HotelProps) => {
  const { firstSlug, secondSlug } = params;

  const isSecondSlugNumeric = /^\d+$/.test(secondSlug);

  if (isSecondSlugNumeric) {
    const hotelSlug = firstSlug;
    const roomNumber = parseInt(secondSlug);
    const bookingDates = await getBookedDates(roomNumber, hotelSlug);
    const hotelRoom = await getSingleHotelRoom(hotelSlug, roomNumber);
    const user = await getServerSideUser();

    if (!hotelRoom) {
      notFound();
    }
    const { room_number, price, damages, amenities, extended, capacity, view } =
      hotelRoom;

    // TODO: improve styling
    return (
      <MaxWidthWrapper>
        <div className="flex flex-col bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Room {room_number}</h1>
          <p className="mb-2">
            <span className="font-bold">Price:</span> {price}
          </p>
          <p className="mb-2">
            <span className="font-bold">Capacity:</span> {capacity}
          </p>
          <p className="mb-2">
            <span className="font-bold">View:</span> {view}
          </p>
          <p className="mb-2">
            <span className="font-bold">Extended:</span>{" "}
            {extended ? "Yes" : "No"}
          </p>
          <p className="mb-2">
            <span className="font-bold">Amenities:</span>{" "}
            {amenities?.join(", ")}
          </p>
          <p className="mb-2">
            <span className="font-bold">Damages:</span> {damages?.join(", ")}
          </p>
          <CustomerBookingForm
            bookingDates={bookingDates}
            user={user}
            hotelRoom={hotelRoom}
          />
        </div>
      </MaxWidthWrapper>
    );
  } else {
    const hotelSlug = secondSlug;
    const bookings = await getAllBookings();
    const rooms = await getHotelRooms(hotelSlug);
    const hotelChains = await getAllHotelChains();
    const hotel = await getSingleHotel(hotelSlug);
    if (!rooms || !hotel) {
      notFound();
    }
    return (
      <MaxWidthWrapper>
        <div className="w-full max-w-screen-xl mx-auto flex items-center flex-col px-5 md:px-0">
          <h1 className="text-4xl font-bold my-10 text-center">
            All Hotel Rooms in {hotel.hotel_name}
          </h1>
          <HotelRoomGrid hotelRooms={rooms} bookings={bookings} />
        </div>
      </MaxWidthWrapper>
    );
  }
};

export default CustomerSecondSlugPage;
