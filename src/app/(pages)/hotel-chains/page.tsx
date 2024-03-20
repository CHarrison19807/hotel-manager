import { getAllHotelChains } from "@/lib/hotelChain";
import { HotelChain } from "@/lib/hotelChain";
import HotelChainItem from "@/components/HotelChainItem";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default async function Home() {
  const hotelChains = await getAllHotelChains();
  return (
    // TODO: REFACTOR PAGE
    <MaxWidthWrapper>
      <div className="w-full max-w-screen-xl mx-auto flex items-center flex-col px-5 md:px-0">
        <h1 className="text-4xl font-bold my-10">All Hotel Chains</h1>
        <div className="w-full grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-y-6 lg:gap-6  ">
          {hotelChains.map((chain: HotelChain) => (
            <HotelChainItem key={chain.chain_name} hotelChain={chain} />
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
