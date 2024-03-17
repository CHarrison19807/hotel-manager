import { getAllHotelChains } from "@/lib/hotelChain";
import HotelChainItem from "@/components/HotelChainItem";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";

export default async function Home() {
  const hotelChains = await getAllHotelChains();
  return (
    <MaxWidthWrapper>
      {/* TODO: HOME PAGE */}
      <Link href="/hotel-chains">
        <p className="text-4xl font-bold my-10">All Hotel Chains</p>
      </Link>
    </MaxWidthWrapper>
  );
}
