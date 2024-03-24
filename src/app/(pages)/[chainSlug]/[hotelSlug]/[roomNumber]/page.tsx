import CustomerBookingForm from "@/components/Bookings/CustomerBookingForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getBookedDates } from "@/lib/booking";
import { getSingleHotelRoom } from "@/lib/hotelRoom";
import { getServerSideUser } from "@/lib/user";
import { notFound } from "next/navigation";

interface HotelRoomProps {
  params: {
    chainSlug: string;
    hotelSlug: string;
    roomNumber: number;
  };
}

const IndividualHotelRoomPage = async (props: HotelRoomProps) => {
  const { chainSlug, hotelSlug, roomNumber } = props.params;
  const bookingDates = await getBookedDates(roomNumber, hotelSlug);
  const hotelRoom = await getSingleHotelRoom(hotelSlug, roomNumber);
  const user = await getServerSideUser();
  const { room_number, price, damages, amenities, extended, capacity, view } =
    hotelRoom;

  if (!hotelRoom) {
    notFound();
  }

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
          <span className="font-bold">Extended:</span> {extended ? "Yes" : "No"}
        </p>
        <p className="mb-2">
          <span className="font-bold">Amenities:</span> {amenities?.join(", ")}
        </p>
        <p className="mb-2">
          <span className="font-bold">Damages:</span> {damages?.join(", ")}
        </p>
        <CustomerBookingForm
          bookingDates={bookingDates}
          user={user}
          hotelRoom={hotelRoom}
          chainSlug={chainSlug}
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default IndividualHotelRoomPage;
