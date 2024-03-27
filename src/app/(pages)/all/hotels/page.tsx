import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import HotelGrid from "@/components/Hotels/HotelGrid";
import { getAllHotels } from "@/lib/hotel";

const AllHotelsPage = async () => {
  const hotels = await getAllHotels();
  return (
    <MaxWidthWrapper>
      <h1 className="text-4xl font-bold my-10 text-center">All Hotels</h1>
      <HotelGrid hotels={hotels} />
    </MaxWidthWrapper>
  );
};

export default AllHotelsPage;
