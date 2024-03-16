"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaHotel } from "react-icons/fa";
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
  hotelChainValidate,
} from "@/lib/validators/hotelChainValidator";
import {
  HotelChain,
  createHotelChain,
  deleteHotelChain,
  updateHotelChain,
} from "@/lib/hotelChain";
import { AnyARecord } from "dns";
import slugify from "slugify";

interface HotelChainFormProps {
  usage: "create" | "edit";
  headerText: string;
  submitText: string;
  hotelChain?: HotelChain;
}

const HotelChainForm = (props: HotelChainFormProps) => {
  const { usage, headerText, submitText, hotelChain: passedHotelChain } = props;
  const hotelChain = usage === "edit" ? passedHotelChain : null;

  const form = useForm<THotelChainValidate>({
    defaultValues: {
      phone_numbers: hotelChain?.phone_numbers || [""],
      email_addresses: hotelChain?.email_addresses || [""],
      chain_name: hotelChain?.chain_name || "",
      central_address: hotelChain?.central_address || "",
    },
    resolver: zodResolver(hotelChainValidate),
  });

  const initialPhoneNumberCount = hotelChain?.phone_numbers.length || 1;
  const initialEmailAddressCount = hotelChain?.email_addresses.length || 1;

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
    if (phoneCount.length > 1) setPhoneCount(phoneCount.slice(0, -1));
  };

  const handleRemoveEmailAddress = () => {
    if (emailCount.length > 1) setEmailCount(emailCount.slice(0, -1));
  };

  const { handleSubmit, control } = form;

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async ({
    chain_name,
    phone_numbers,
    email_addresses,
    central_address,
  }: THotelChainValidate) => {
    setIsLoading(true);
    const newHotelChain: HotelChain = {
      chain_name,
      phone_numbers,
      email_addresses,
      central_address,
    };
    if (usage === "create") {
      let error = "";
      error = await createHotelChain(newHotelChain);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Hotel Chain Created Successfully");
        router.push("/admin/hotel-chains");
        router.refresh();
      }
    } else {
      newHotelChain.chain_slug = slugify(hotelChain?.chain_name as string, {
        lower: true,
      });
      let error = "";
      error = await updateHotelChain(newHotelChain);
      if (error) {
        toast.error(error);
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
    if (await deleteHotelChain(chain_name)) {
      toast.success("Hotel Chain Deleted Successfully");
      router.push("/admin/hotel-chains");
      router.refresh();
    } else {
      toast.error(
        "Unexpected error occurred while deleting hotel chain. Please try again."
      );
    }
    setIsLoading(false);
  };
  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[375px]">
        <div className="flex flex-col space-y-2 items-center text-center">
          <FaHotel className="w-20 h-20" />
          <h1 className="text-2xl font-bold">{headerText}</h1>
        </div>
        <div className="flex justify-around mb-6">
          <div className="flex flex-col">
            <Button
              variant="ghost"
              type="button"
              onClick={handleAddPhoneNumber}
            >
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
            <Button
              variant="ghost"
              type="button"
              onClick={handleAddEmailAddress}
            >
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <FormField
                  control={control}
                  name="chain_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hotel Chain Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Hotel Chain Name"
                          {...field}
                          disabled={usage === "edit"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {phoneCount.map((index: number) => {
                  return (
                    <FormField
                      control={control}
                      key={phoneCount[index]}
                      name={`phone_numbers.${index}`}
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
                      control={control}
                      key={emailCount[index]}
                      name={`email_addresses.${index}`}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="email@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  );
                })}
                <FormField
                  control={control}
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
                      <p>{submitText}</p>
                    )}
                  </Button>
                  {usage === "edit" && (
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
      </div>
    </div>
  );
};

export default HotelChainForm;
