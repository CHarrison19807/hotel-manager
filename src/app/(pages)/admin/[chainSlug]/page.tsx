import HotelChainForm from "@/components/HotelChains/HotelChainForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getSingleHotelChain } from "@/lib/hotelChain";
import { notFound } from "next/navigation";

interface EditHotelChainProps {
  params: {
    chainSlug: string;
  };
}

const EditHotelChainPage = async ({ params }: EditHotelChainProps) => {
  const { chainSlug } = params;
  const hotelChain = await getSingleHotelChain(chainSlug);

  if (!hotelChain) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <HotelChainForm hotelChain={hotelChain} />
    </MaxWidthWrapper>
  );
};

export default EditHotelChainPage;
