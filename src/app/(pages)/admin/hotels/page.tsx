import columns from "@/components/Hotels/HotelColumns";
import DataTable from "@/components/DataTable";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAllHotels } from "@/lib/hotel";

const ViewHotelsAsEmployeePage = async () => {
  const hotels = await getAllHotels();

  return (
    <MaxWidthWrapper>
      <div className="container py-10">
        <DataTable
          columns={columns}
          data={hotels}
          action={true}
          actionHref="/admin/hotels/new"
          actionText="Create Hotel"
          filter={true}
          filterPlaceholder="Filter by hotel chain..."
          filterColumn="chain_slug"
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default ViewHotelsAsEmployeePage;
