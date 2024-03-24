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
  THotelChainValidate,
  HotelChainValidate,
} from "@/lib/validators/hotelChainValidator";
import {
  HotelChain,
  createHotelChain,
  deleteHotelChain,
  updateHotelChain,
} from "@/lib/hotelChain";
import FormWrapper from "../FormWrapper";

interface HotelChainFormProps {
  hotelChain?: HotelChain;
}

const HotelChainForm = (props: HotelChainFormProps) => {
  const { hotelChain } = props;
  const { chain_name, phone_numbers, email_addresses, central_address } =
    hotelChain || {};

  const form = useForm<THotelChainValidate>({
    defaultValues: {
      chain_name: chain_name || "",
      central_address: central_address || "",
    },
    resolver: zodResolver(HotelChainValidate),
  });

  const initialPhoneNumberCount = phone_numbers?.length || 1;
  const initialEmailAddressCount = email_addresses?.length || 1;

  const phoneNumberArray = Array.from(
    { length: initialPhoneNumberCount },
    (_, index) => index
  );
  const emailAddressArray = Array.from(
    { length: initialEmailAddressCount },
    (_, index) => index
  );

  const [phoneCount, setPhoneCount] = useState(phoneNumberArray || [0]);
  const [emailCount, setEmailCount] = useState(emailAddressArray || [0]);

  const handleAddPhoneNumber = () => {
    setPhoneCount([...phoneCount, phoneCount[phoneCount.length - 1] + 1]);
  };

  const handleAddEmailAddress = () => {
    setEmailCount([...emailCount, emailCount[emailCount.length - 1] + 1]);
  };

  const handleRemovePhoneNumber = () => {
    const index = phoneCount[phoneCount.length - 1];
    if (phoneCount.length > 1) setPhoneCount(phoneCount.slice(0, -1));
    form.unregister(`phone_numbers.${index}`);
    form.setValue(
      `phone_numbers`,
      form.getValues().phone_numbers.filter((_, i) => i !== index)
    );
  };

  const handleRemoveEmailAddress = () => {
    const index = emailCount[emailCount.length - 1];
    if (emailCount.length > 1) setEmailCount(emailCount.slice(0, -1));
    form.unregister(`email_addresses.${index}`);
    form.setValue(
      `email_addresses`,
      form.getValues().email_addresses.filter((_, i) => i !== index)
    );
  };

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (data: THotelChainValidate) => {
    setIsLoading(true);
    if (hotelChain) {
      const result = await updateHotelChain(data);
      if (result) {
        toast.error(result);
      } else {
        toast.success("Hotel Chain Updated Successfully");
        router.push("/admin/hotel-chains");
        router.refresh();
      }
    } else {
      const result = await createHotelChain(data);
      if (result) {
        toast.error(result);
      } else {
        toast.success("Hotel Chain Created Successfully");
        router.push("/admin/hotel-chains");
        router.refresh();
      }
    }
    setIsLoading(false);
  };

  const handleDelete = async (chain_name: string) => {
    setIsLoading(true);
    const result = await deleteHotelChain(chain_name);
    if (result) {
      toast.error(result);
    } else {
      toast.success("Hotel Chain Deleted Successfully");
      router.push("/admin/hotel-chains");
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <FormWrapper
      headerText={hotelChain ? "Edit Hotel Chain" : "Create Hotel Chain"}
    >
      <div className="flex justify-around mb-6">
        <div className="flex flex-col">
          <Button variant="ghost" type="button" onClick={handleAddPhoneNumber}>
            <p className="sm:block hidden">Add Phone Number</p>
            <p className="sm:hidden block">Add Phone</p>
          </Button>
          <Button
            disabled={phoneCount.length === 1}
            variant="ghost"
            type="button"
            onClick={handleRemovePhoneNumber}
          >
            <p className="sm:block hidden">Remove Phone Number</p>
            <p className="sm:hidden block">Remove Phone</p>{" "}
          </Button>
        </div>

        <div className="flex flex-col">
          <Button variant="ghost" type="button" onClick={handleAddEmailAddress}>
            <p className="sm:block hidden">Add Email Address</p>
            <p className="sm:hidden block">Add Email</p>
          </Button>
          <Button
            disabled={emailCount.length === 1}
            variant="ghost"
            type="button"
            onClick={handleRemoveEmailAddress}
          >
            <p className="sm:block hidden">Remove Email Address</p>
            <p className="sm:hidden block">Remove Email</p>
          </Button>
        </div>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="chain_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Chain Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Hotel Chain Name"
                        {...field}
                        disabled={hotelChain ? true : false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {phoneCount.map((index: number) => {
                return (
                  <FormField
                    control={form.control}
                    key={phoneCount[index]}
                    name={`phone_numbers.${index}`}
                    defaultValue={phone_numbers ? phone_numbers[index] : ""}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="123-456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                );
              })}
              {emailCount.map((index: number) => {
                return (
                  <FormField
                    control={form.control}
                    key={emailCount[index]}
                    name={`email_addresses.${index}`}
                    defaultValue={email_addresses ? email_addresses[index] : ""}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                );
              })}
              <FormField
                control={form.control}
                name="central_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Central Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2 py-4">
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
                {hotelChain && (
                  <Button
                    type="button"
                    onClick={() =>
                      handleDelete(hotelChain?.chain_name as string)
                    }
                    disabled={isLoading}
                    variant="destructive"
                  >
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <Loader2 className="animate-spin mr-3" />
                        <span>Loading</span>
                      </div>
                    ) : (
                      <p>Delete {hotelChain?.chain_name}</p>
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

export default HotelChainForm;
