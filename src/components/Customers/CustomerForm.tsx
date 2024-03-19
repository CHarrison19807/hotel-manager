"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import {
  Customer,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "@/lib/customer";
import {
  CustomerValidator,
  TCustomerValidator,
} from "@/lib/validators/customerValidator";
import { formatSIN } from "@/lib/utils";
import FormWrapper from "../FormWrapper";
import { getServerSideUser, isSelfOrEmployee } from "@/lib/user";
import { Employee } from "@/lib/employee";

interface CustomerFormProps {
  customer?: Customer;
}

const CustomerForm = (props: CustomerFormProps) => {
  const customer = props.customer;
  const { full_name, address, sin } = customer ?? {};
  const form = useForm<TCustomerValidator>({
    defaultValues: {
      full_name,
      address,
      sin,
    },
    resolver: zodResolver(CustomerValidator),
  });

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleDelete = async (sin: string) => {
    setIsLoading(true);
    if (await isSelfOrEmployee(sin)) {
      const result = await deleteCustomer(sin);

      if (result) {
        toast.error(result);
      } else {
        toast.success(`Succesfully deleted customer!`);
        router.push("/customers");
        router.refresh();
      }
    } else {
      toast.error("You do not have permission to delete this customer.");
    }
    setIsLoading(false);
  };

  const onSubmit = async (data: TCustomerValidator) => {
    setIsLoading(true);
    const { full_name, address, sin } = data;
    let result: string;
    let create: boolean;
    if (customer) {
      result = await updateCustomer(full_name, address, sin);
      create = false;
    } else {
      result = await createCustomer(full_name, address, sin);
      create = true;
    }
    setIsLoading(false);

    if (result) {
      toast.error(result);
    } else {
      const verb = create ? "created" : "updated";
      toast.success(`Succesfully ${verb} customer!`);
      router.push("/customers");
      router.refresh();
    }
  };

  return (
    <FormWrapper headerText={customer ? "Edit Customer" : "Create Customer"}>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Smith"
                        {...field}
                        value={full_name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St"
                        {...field}
                        value={address}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123-456-789"
                        {...field}
                        value={
                          sin === undefined ? sin : formatSIN(sin as string)
                        }
                        disabled={sin !== undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3 pt-4">
                <Button disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader2 className="animate-spin mr-3" />
                      <span>Loading</span>
                    </div>
                  ) : (
                    <p>Submit</p>
                  )}
                </Button>
                {customer && (
                  <Button
                    type="button"
                    onClick={() => handleDelete(sin as string)}
                    disabled={isLoading}
                    variant="destructive"
                  >
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <Loader2 className="animate-spin mr-3" />
                        <span>Loading</span>
                      </div>
                    ) : (
                      <p>Delete {full_name}</p>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </FormWrapper>
  );
};

export default CustomerForm;
