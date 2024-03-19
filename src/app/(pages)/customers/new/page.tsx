import CustomerForm from "@/components/Customers/CustomerForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const CreateCustomerPage = async () => {
  return (
    <MaxWidthWrapper>
      <CustomerForm />
    </MaxWidthWrapper>
  );
};

export default CreateCustomerPage;
