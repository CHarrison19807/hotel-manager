import HotelChainForm from "@/components/HotelChainForm";
import HotelForm from "@/components/HotelForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
// TODO: BREADCRUMBS ON ALL PAGES

const CreateHotelPage = () => {
  return (
    <MaxWidthWrapper>
      <HotelForm
        props={{
          usage: "create",
          headerText: `Create a New Hotel `,
          submitText: "Create Hotel",
        }}
      />
    </MaxWidthWrapper>
  );
};

export default CreateHotelPage;
