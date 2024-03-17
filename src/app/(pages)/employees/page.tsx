import EmployeeColumns from "@/components/Employees/EmployeeColumns";
import DataTable from "@/components/DataTable";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAllEmployees } from "@/lib/employee";

const ViewEmployeesPage = async () => {
  const employees = await getAllEmployees();

  return (
    <MaxWidthWrapper>
      <div className="container py-10">
        <DataTable
          columns={EmployeeColumns}
          data={employees}
          actionHref="/employees/new"
          actionText="Create Employee"
          filter={true}
          filterPlaceholder="Filter by hotels..."
          filterColumn="hotel"
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default ViewEmployeesPage;
