import { getAllHotelChains } from "@/lib/hotelChain";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import HotelChainGrid from "@/components/HotelChains/HotelChainGrid";

const AllHotelChainsPage = async () => {
  const hotelChains = await getAllHotelChains();
  return (
    <MaxWidthWrapper>
      <h1 className="text-4xl font-bold my-10 text-center">All Hotel Chains</h1>
      <HotelChainGrid hotelChains={hotelChains} />
    </MaxWidthWrapper>
  );
};

export default AllHotelChainsPage;
