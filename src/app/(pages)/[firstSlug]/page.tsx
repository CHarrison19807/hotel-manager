import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getChainHotels } from "@/lib/hotel";
import { getSingleHotelChain } from "@/lib/hotelChain";
import { notFound } from "next/navigation";
import HotelGrid from "@/components/Hotels/HotelGrid";

interface HotelChainProps {
  params: {
    firstSlug: string;
  };
}

const HotelChainPage = async ({ params }: HotelChainProps) => {
  const { firstSlug } = params;
  const chainSlug = firstSlug;
  const hotels = await getChainHotels(chainSlug);
  const hotelChain = await getSingleHotelChain(chainSlug);

  if (!hotels || !hotelChain) {
    notFound();
  }

  const { chain_name: hotelChainName } = hotelChain;

  return (
    <MaxWidthWrapper>
      <div className="w-full max-w-screen-xl mx-auto flex items-center flex-col px-5 md:px-0">
        <h1 className="text-4xl text-center font-bold my-10">
          All Hotels Part of {hotelChainName}
        </h1>
        <HotelGrid hotels={hotels} />
      </div>
    </MaxWidthWrapper>
  );
};

export default HotelChainPage;
