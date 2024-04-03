import DataTable from "@/components/DataTable";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {
  HotelCapacityColumns,
  RoomRatingColumns,
} from "@/components/Views/ViewColumns";
import {
  HotelCapacity,
  RoomCount,
  hotelCapacity,
  roomsByRating,
} from "@/lib/views";

const AdminInfoPage = async () => {
  const rooms: RoomCount[] = await roomsByRating();
  const hotels: HotelCapacity[] = await hotelCapacity();

  return (
    <MaxWidthWrapper>
      <p className="text-4xl font-bold my-10 text-center">
        Available Rooms per Hotel Rating
      </p>

      <DataTable
        columns={RoomRatingColumns}
        data={rooms}
        action={false}
        filter={false}
      />
      <p className="text-4xl font-bold my-10 text-center">Capacity at Hotels</p>

      <DataTable
        columns={HotelCapacityColumns}
        data={hotels}
        action={false}
        filter={false}
      />
    </MaxWidthWrapper>
  );
};
export default AdminInfoPage;
