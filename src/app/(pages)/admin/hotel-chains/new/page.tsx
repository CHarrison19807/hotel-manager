import HotelChainForm from "@/components/HotelChains/HotelChainForm";

const CreateHotelChainPage = async () => {
  return (
    <HotelChainForm
      usage="create"
      headerText="Create a new Hotel Chain"
      submitText="Create Hotel Chain"
    />
  );
};

export default CreateHotelChainPage;
