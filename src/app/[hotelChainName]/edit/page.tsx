import HotelChainForm from "@/components/HotelChainForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getSingleHotelChain } from "@/lib/hotelChain";
import { hotel_chain } from "@/lib/utils";
import { notFound } from "next/navigation";

interface HotelChainProps {
  params: {
    hotelChainName: string;
  };
}
const EditHotelChainPage = async ({ params }: HotelChainProps) => {
  const { hotelChainName } = params;
  const hotelChain = await getSingleHotelChain(hotelChainName);

  if (!hotelChain) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <HotelChainForm
        props={{
          usage: "edit",
          headerText: `Edit the ${hotelChain.chain_name} Hotel Chain `,
          submitText: "Edit Hotel Chain",
          hotelChain: hotelChain as hotel_chain,
        }}
      />
    </MaxWidthWrapper>
  );
};
export default EditHotelChainPage;
