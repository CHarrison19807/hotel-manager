import EmployeeBookingForm from "@/components/Bookings/EmployeeBookingForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAllCustomers } from "@/lib/customer";
import { getAllHotels } from "@/lib/hotel";

const NewBookingPage = async () => {
  const customers = await getAllCustomers();
  const hotels = await getAllHotels();
  return (
    <MaxWidthWrapper>
      <EmployeeBookingForm customers={customers} hotels={hotels} />
    </MaxWidthWrapper>
  );
};

export default NewBookingPage;
