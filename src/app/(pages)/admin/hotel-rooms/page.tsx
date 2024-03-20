import columns from "@/components/HotelRooms/HotelRoomColumns";
import DataTable from "@/components/DataTable";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAllHotelRooms } from "@/lib/hotelRoom";

const ViewHotelRoomsAsEmployeePage = async () => {
  const hotelRooms = await getAllHotelRooms();

  return (
    <MaxWidthWrapper>
      <div className="container py-10">
        <DataTable
          columns={columns}
          data={hotelRooms}
          actionHref="/admin/hotel-rooms/new"
          actionText="Create Hotel Room"
          filter={true}
          filterPlaceholder="Filter by hotel..."
          filterColumn="hotel"
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default ViewHotelRoomsAsEmployeePage;
