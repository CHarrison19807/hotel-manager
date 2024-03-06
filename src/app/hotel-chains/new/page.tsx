import HotelChainForm from "@/components/HotelChainForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const CreateHotelChainPage = () => {
  return (
    <MaxWidthWrapper>
      <HotelChainForm
        props={{
          usage: "create",
          headerText: `Create a New Hotel Chain `,
          submitText: "Create Hotel Chain",
        }}
      />
    </MaxWidthWrapper>
  );
};

export default CreateHotelChainPage;
