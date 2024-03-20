import HotelRoomForm from "@/components/HotelRooms/HotelRoomForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAllHotels } from "@/lib/hotel";

const CreateNewHotelRoomPage = async () => {
  const hotels = await getAllHotels();
  return (
    <MaxWidthWrapper>
      <HotelRoomForm hotels={hotels} />
    </MaxWidthWrapper>
  );
};

export default CreateNewHotelRoomPage;
