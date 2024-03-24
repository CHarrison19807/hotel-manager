import BookingColumns from "@/components/Bookings/BookingsColumns";
import DataTable from "@/components/DataTable";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getCustomerBookings } from "@/lib/booking";

interface CustomerBookingPageProps {
  params: {
    customerSIN: string;
  };
}

const CustomerBookingsPage = async (props: CustomerBookingPageProps) => {
  const { customerSIN } = props.params;
  const bookings = await getCustomerBookings(customerSIN);
  const columns = BookingColumns;
  return (
    <MaxWidthWrapper>
      <DataTable
        columns={columns}
        data={bookings}
        filter={true}
        filterPlaceholder="Filter by hotel..."
        filterColumn="hotel"
        action={false}
      />
    </MaxWidthWrapper>
  );
};

export default CustomerBookingsPage;
