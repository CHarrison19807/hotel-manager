import { HotelChain } from "@/lib/hotelChain";
import MaxWidthWrapper from "../MaxWidthWrapper";
import HotelChainItem from "./HotelChainItem";

interface HotelChainGridProps {
  hotelChains: HotelChain[];
}
const HotelChainGrid = (props: HotelChainGridProps) => {
  const { hotelChains } = props;
  return (
    <MaxWidthWrapper>
      <div className="w-full grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-y-6 lg:gap-6">
        {hotelChains.map((hotelChain: HotelChain, index: number) => (
          <HotelChainItem
            key={hotelChain.chain_slug}
            index={index}
            hotelChain={hotelChain}
          />
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default HotelChainGrid;
