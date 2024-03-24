import EmployeeColumns from "@/components/Employees/EmployeeColumns";
import DataTable from "@/components/DataTable";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Employee, getAllEmployees } from "@/lib/employee";

const ViewEmployeesPage = async () => {
  const employees: Employee[] = await getAllEmployees();
  return (
    <MaxWidthWrapper>
      <div className="container py-10">
        <DataTable
          columns={EmployeeColumns}
          data={employees}
          action={true}
          actionHref="/employees/new"
          actionText="Create Employee"
          filter={true}
          filterPlaceholder="Filter by hotel..."
          filterColumn="hotel"
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default ViewEmployeesPage;
