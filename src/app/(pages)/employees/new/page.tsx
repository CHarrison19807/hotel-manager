import EmployeeForm from "@/components/Employees/EmployeeForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAllHotels } from "@/lib/hotel";

const CreateEmployeePage = async () => {
  const hotels = await getAllHotels();

  return (
    <MaxWidthWrapper>
      <EmployeeForm hotels={hotels} />
    </MaxWidthWrapper>
  );
};

export default CreateEmployeePage;
