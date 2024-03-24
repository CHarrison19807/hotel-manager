import CustomerColumns from "@/components/Customers/CustomerColumns";
import DataTable from "@/components/DataTable";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAllCustomers } from "@/lib/customer";

const ViewCustomersPage = async () => {
  const customers = await getAllCustomers();

  return (
    <MaxWidthWrapper>
      <div className="container py-10">
        <DataTable
          columns={CustomerColumns}
          data={customers}
          action={true}
          actionHref="/customers/new"
          actionText="Create Customer"
          filter={true}
          filterPlaceholder="Filter by name..."
          filterColumn="full_name"
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default ViewCustomersPage;
