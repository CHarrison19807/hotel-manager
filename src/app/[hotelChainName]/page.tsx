import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getHotels } from "@/lib/hotel";
import { notFound } from "next/navigation";

interface HotelChainProps {
  params: {
    hotelChainName: string;
  };
}

const HotelChainPage = async ({ params }: HotelChainProps) => {
  const { hotelChainName } = params;
  const hotels = await getHotels(hotelChainName);

  if (!hotels) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <h1>Hotels part of {hotelChainName}</h1>
    </MaxWidthWrapper>
  );
};

export default HotelChainPage;
