import { getSingleHotelRoom } from "@/lib/hotelRoom";
import { notFound } from "next/navigation";

interface HotelRoomProps {
  params: {
    hotelNameSlug: string;
    roomNumber: number;
  };
}

const IndividualHotelRoomPage = async ({ params }: HotelRoomProps) => {
  const { hotelNameSlug, roomNumber } = params;
  const room = await getSingleHotelRoom(hotelNameSlug, roomNumber);
  if (!room) {
    notFound();
  }
  return (
    <div>
      <h1>Room {room.roomNumber}</h1>
      <p>{room.price}</p>
    </div>
  );
};

export default IndividualHotelRoomPage;
