import HotelChainForm from "@/components/HotelChains/HotelChainForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getSingleHotelChain } from "@/lib/hotelChain";
import { notFound } from "next/navigation";

interface EditHotelChainProps {
  params: {
    hotelChainSlug: string;
  };
}

const EditHotelChainPage = async ({ params }: EditHotelChainProps) => {
  const { hotelChainSlug } = params;
  const hotelChain = await getSingleHotelChain(hotelChainSlug);

  if (!hotelChain) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <HotelChainForm
        headerText={`Edit ${hotelChain.chain_name}`}
        submitText="Save Hotel Chain"
        usage="edit"
        hotelChain={hotelChain}
      />
    </MaxWidthWrapper>
  );
};

export default EditHotelChainPage;
