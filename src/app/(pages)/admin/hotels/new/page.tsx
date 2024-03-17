import HotelForm from "@/components/Hotels/HotelForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAllHotelChains } from "@/lib/hotelChain";

const CreateNewHotelPage = async () => {
  const hotelChains = await getAllHotelChains();
  return (
    <MaxWidthWrapper>
      {/* Issue with duplicate P_key on hotel  */}
      <HotelForm
        headerText="Create New Hotel"
        submitText="Create Hotel"
        usage="create"
        hotelChains={hotelChains}
      />
    </MaxWidthWrapper>
  );
};

export default CreateNewHotelPage;
