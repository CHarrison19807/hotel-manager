import CustomerForm from "@/components/Customers/CustomerForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { getCustomer } from "@/lib/customer";
import { notFound } from "next/navigation";
interface EditCustomerPageProps {
  params: {
    CustomerSIN: string;
  };
}
const EditCustomerPage = async ({ params }: EditCustomerPageProps) => {
  const { CustomerSIN } = params;

  const customer = await getCustomer(CustomerSIN);

  if (!customer) {
    return notFound();
  }

  return (
    <MaxWidthWrapper>
      <CustomerForm customer={customer} />
    </MaxWidthWrapper>
  );
};

export default EditCustomerPage;
