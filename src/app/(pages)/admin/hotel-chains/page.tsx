import columns from "@/components/HotelChains/HotelChainColumns";
import DataTable from "@/components/DataTable";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAllHotelChains } from "@/lib/hotelChain";

const ViewHotelChainsAsEmployeePage = async () => {
  const hotelChains = await getAllHotelChains();

  return (
    <MaxWidthWrapper>
      <div className="container py-10">
        <DataTable
          columns={columns}
          data={hotelChains}
          action={true}
          actionHref="/admin/hotel-chains/new"
          actionText="Create Hotel Chain"
          filter={true}
          filterPlaceholder="Filter by hotel chain..."
          filterColumn="chain_name"
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default ViewHotelChainsAsEmployeePage;
