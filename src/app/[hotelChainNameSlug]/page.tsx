import CreateNew from "@/components/CreateNewItem";
import HotelItem from "@/components/HotelItem";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getHotels, getSingleHotel } from "@/lib/hotel";
import { getSingleHotelChain } from "@/lib/hotelChain";
import { hotel } from "@/lib/utils";
import { notFound } from "next/navigation";

interface HotelChainProps {
  params: {
    hotelChainNameSlug: string;
  };
}

const HotelChainPage = async ({ params }: HotelChainProps) => {
  const { hotelChainNameSlug } = params;
  const hotels = await getHotels(hotelChainNameSlug);
  const hotelChain = await getSingleHotelChain(hotelChainNameSlug);

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
          <CreateNew
            href={`/${hotelChainName}/new`}
            cta={`Create a New Hotel in ${hotelChainName}`}
            description="Click the button above to create a new hotel!"
          />
          {hotels.map((hotel: hotel) => (
            <HotelItem key={hotel.hotel_name} hotel={hotel} />
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default HotelChainPage;
