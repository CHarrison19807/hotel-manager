import DataTable from "@/components/DataTable";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import BookingColumns from "@/components/Bookings/BookingsColumns";
import { getAllBookings } from "@/lib/booking";

const ViewBookingsPage = async () => {
  const bookings = await getAllBookings();

  return (
    <MaxWidthWrapper>
      <div className="container py-10">
        <DataTable
          columns={BookingColumns}
          data={bookings}
          action={true}
          actionHref="/bookings/new"
          actionText="Create Booking"
          filter={true}
          filterPlaceholder="Filter by hotel..."
          filterColumn="hotel"
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default ViewBookingsPage;
