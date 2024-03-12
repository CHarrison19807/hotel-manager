"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import {
  hotelChainValidate,
  THotelChainValidate,
} from "@/lib/validators/hotelChainValidator";
import {
  createHotelChain,
  deleteHotelChain,
  updateHotelChain,
} from "@/lib/hotelChain";
import { FaArrowLeft, FaHotel } from "react-icons/fa";
import { useState } from "react";
import { hotel_chain } from "@/lib/utils";
import { useEmployeeContext } from "@/contexts/EmployeeContext";

interface HotelChainFormProps {
  props: {
    hotelChain?: hotel_chain;
    headerText: string;
    submitText: string;
    usage: string;
  };
}

const HotelChainForm = ({ props }: HotelChainFormProps) => {
  const { headerText, submitText, hotelChain, usage } = props;
  const { isEmployee } = useEmployeeContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(hotelChainValidate),
  });

  const router = useRouter();

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

  const [phoneNumberCount, setPhoneNumberCount] = useState(
    phoneNumberArray || [0]
  );
  const [emailAddressCount, setEmailAddressCount] = useState(
    emailAddressArray || [0]
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPhoneNumber = () => {
    setPhoneNumberCount([
      ...phoneNumberCount,
      phoneNumberCount[phoneNumberCount.length - 1] + 1,
    ]);
  };

  const handleAddEmailAddress = () => {
    setEmailAddressCount([
      ...emailAddressCount,
      emailAddressCount[emailAddressCount.length - 1] + 1,
    ]);
  };

  const handleRemovePhoneNumber = () => {
    if (phoneNumberCount.length > 1)
      setPhoneNumberCount(phoneNumberCount.slice(0, -1));
  };

  const handleRemoveEmailAddress = () => {
    if (emailAddressCount.length > 1)
      setEmailAddressCount(emailAddressCount.slice(0, -1));
  };

  const handleDelete = (chain_name: string | undefined) => async () => {
    if (!chain_name) return;
    try {
      setIsLoading(true);
      await deleteHotelChain(chain_name);
      toast.success(`Deleted ${chain_name} successfully!`);
      router.push("/hotel-chains");
      router.refresh();
    } catch (error) {
      toast.error(`Error deleting ${chain_name}!`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async ({
    chain_name,
    phone_numbers,
    email_addresses,
    central_address,
  }: THotelChainValidate) => {
    try {
      setIsLoading(true);
      if (usage === "create") {
        if (
          (await createHotelChain({
            chain_name,
            phone_numbers,
            email_addresses,
            central_address,
          })) === 1
        ) {
          toast.error("Hotel Chain Name or Central Address already exists!");
        } else {
          toast.success(`Created ${chain_name} successfully!`);
          router.push("/hotel-chains");
          router.refresh();
        }
      } else {
        if (
          (await updateHotelChain({
            chain_name,
            phone_numbers,
            email_addresses,
            central_address,
          })) === 1
        ) {
          toast.error("Central Address already exists!");
        } else {
          toast.success(`Updated ${chain_name} successfully!`);
          router.push("/hotel-chains");
          router.refresh();
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(error.errors);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  if (isEmployee) {
    return (
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[375px]">
          <div className="flex flex-col space-y-2 items-center text-center">
            <FaHotel className="w-20 h-20" />
            <h1 className="text-2xl font-bold">{headerText}</h1>
          </div>
          <div className="grid gap-6">
            {/* @ts-expect-error */}
            <form onSubmit={handleSubmit(onSubmit)}>
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
                    disabled={phoneNumberCount.length === 1}
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
                    disabled={emailAddressCount.length === 1}
                    variant="ghost"
                    type="button"
                    onClick={handleRemoveEmailAddress}
                  >
                    <p className="sm:block hidden">Remove Email Address</p>
                    <p className="sm:hidden block">Remove Email</p>
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="chain_name">Hotel Chain Name</Label>
                  <Input
                    {...register("chain_name")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.chain_name,
                      "hover:cursor-not-allowed": usage === "edit",
                    })}
                    defaultValue={hotelChain?.chain_name}
                    readOnly={usage === "edit"}
                    placeholder="Hotel Chain Name"
                    type="text"
                  />
                  {errors?.chain_name && (
                    <p className="text-sm text-red-500">
                      {errors.chain_name.message?.toString()}
                    </p>
                  )}
                </div>

                {phoneNumberCount.map((index) => {
                  const name = `phone_numbers[${index}]`;
                  // @ts-expect-error - I don't know how to fix this
                  const error = errors.phone_numbers?.[index];
                  return (
                    <div
                      className="grid gap-1 py-2"
                      key={phoneNumberCount[index]}
                    >
                      <Label htmlFor={name}>Phone Number</Label>
                      <Input
                        {...register(name)}
                        defaultValue={hotelChain?.phone_numbers[index]}
                        type="text"
                        className={cn({
                          "focus-visible:ring-red-500": error,
                        })}
                        placeholder="123-456-7890"
                      />
                      {error && (
                        <p className="text-sm text-red-500">
                          {error.message?.toString()}
                        </p>
                      )}
                    </div>
                  );
                })}
                {emailAddressCount.map((index) => {
                  const name = `email_addresses[${index}]`;
                  // @ts-expect-error - I don't know how to fix this
                  const error = errors.email_addresses?.[index];
                  return (
                    <div
                      className="grid gap-1 py-2"
                      key={emailAddressCount[index]}
                    >
                      <Label htmlFor={name}>Email Address</Label>
                      <Input
                        {...register(name)}
                        defaultValue={hotelChain?.email_addresses[index]}
                        type="email"
                        className={cn({
                          "focus-visible:ring-red-500": error,
                        })}
                        placeholder="hotel@example.com"
                      />
                      {error && (
                        <p className="text-sm text-red-500">
                          {error.message?.toString()}
                        </p>
                      )}
                    </div>
                  );
                })}
                <div className="grid gap-1 py-2">
                  <Label htmlFor="central_address">Central Address</Label>
                  <Input
                    {...register("central_address")}
                    defaultValue={hotelChain?.central_address}
                    type="text"
                    className={cn({
                      "focus-visible:ring-red-500": errors.central_address,
                    })}
                    placeholder="123 Main St"
                  />
                  {errors?.central_address && (
                    <p className="text-sm text-red-500">
                      {errors.central_address.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
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
                      onClick={handleDelete(hotelChain?.chain_name)}
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
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className=" flex pt-20 flex-col items-center justify-center lg:px-0  mx-auto text-center gap-4">
      <h1 className="text-red-600 uppercase text-xl font-bold">
        Customers can not {usage} hotel chains
      </h1>
      <Button
        variant="outline"
        className="max-w-[300px] w-full mx-auto flex items-center justify-center gap-2 text-lg py-2 h-auto"
        onClick={() => {
          router.back();
        }}
      >
        <FaArrowLeft />
        <p>Go Back</p>
      </Button>
    </div>
  );
};

export default HotelChainForm;
