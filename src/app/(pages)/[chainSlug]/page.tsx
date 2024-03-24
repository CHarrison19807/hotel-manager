import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getChainHotels } from "@/lib/hotel";
import { getSingleHotelChain } from "@/lib/hotelChain";
import { Hotel } from "@/lib/hotel";
import { notFound } from "next/navigation";
import HotelItem from "@/components/Hotels/HotelItem";

interface HotelChainProps {
  params: {
    chainSlug: string;
  };
}

const HotelChainPage = async ({ params }: HotelChainProps) => {
  const { chainSlug } = params;
  const hotels = await getChainHotels(chainSlug);
  const hotelChain = await getSingleHotelChain(chainSlug);

  if (!hotels || !hotelChain) {
    notFound();
  }

  const { chain_name: hotelChainName } = hotelChain;

  return (
    <MaxWidthWrapper>
      <div className="w-full max-w-screen-xl mx-auto flex items-center flex-col px-5 md:px-0">
        <h1 className="text-4xl font-bold my-10">
          All Hotels Part of {hotelChainName}
        </h1>
        <div className="w-full grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-y-6 lg:gap-6  ">
          {hotels.map((hotel: Hotel) => (
            <HotelItem key={hotel.hotel_name} hotel={hotel} />
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default HotelChainPage;
