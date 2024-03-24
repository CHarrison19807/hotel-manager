import HotelForm from "@/components/Hotels/HotelForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAllHotelChains } from "@/lib/hotelChain";

const CreateNewHotelPage = async () => {
  const hotelChains = await getAllHotelChains();
  return (
    <MaxWidthWrapper>
      <HotelForm hotelChains={hotelChains} />
    </MaxWidthWrapper>
  );
};

export default CreateNewHotelPage;
