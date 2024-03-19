import EmployeeForm from "@/components/Employees/EmployeeForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getEmployee } from "@/lib/employee";
import { getAllHotels } from "@/lib/hotel";
import { notFound } from "next/navigation";

interface EmployeePageProps {
  params: {
    EmployeeSIN: string;
  };
}

const EmployeePage = async ({ params }: EmployeePageProps) => {
  const { EmployeeSIN } = params;
  const hotels = await getAllHotels();
  const employee = await getEmployee(EmployeeSIN);

  if (!employee) {
    return notFound();
  }

  return (
    <MaxWidthWrapper>
      <EmployeeForm hotels={hotels} employee={employee} />
    </MaxWidthWrapper>
  );
};

export default EmployeePage;
