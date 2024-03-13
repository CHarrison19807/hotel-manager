"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, hotel } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ZodError } from "zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaHotel } from "react-icons/fa";
import { useState } from "react";
import { useEmployeeContext } from "@/contexts/EmployeeContext";
import {
  THotelValidate,
  hotelValidate,
} from "@/lib/validators/hotelValidators";
import { createHotel, deleteHotel, updateHotel } from "@/lib/hotel";
import { Rating, chipClasses } from "@mui/material";

interface HotelFormProps {
  props: {
    hotel?: hotel;
    headerText: string;
    submitText: string;
    usage: string;
  };
}

const HotelForm = ({ props }: HotelFormProps) => {
  const { headerText, submitText, hotel, usage } = props;
  const [rating, setRating] = useState(hotel?.rating || 0);
  const [ratingError, setRatingError] = useState(false);

  const { isEmployee } = useEmployeeContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(hotelValidate),
  });

  const router = useRouter();
  const pathname = usePathname();
  const chain_slug = pathname.split("/")[1];

  const initialPhoneNumberCount = hotel?.phone_numbers.length || 1;
  const initialEmailAddressCount = hotel?.email_addresses.length || 1;
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

  const handleDelete =
    (hotel_name: string | undefined, chain_name: string | undefined) =>
    async () => {
      if (!hotel_name || !chain_name) return;
      try {
        setIsLoading(true);
        await deleteHotel(hotel_name, chain_name);
        toast.success(`Deleted ${hotel_name} successfully!`);
        router.back();
        router.refresh();
      } catch (error) {
        toast.error(`Error deleting ${hotel_name}!`);
      } finally {
        setIsLoading(false);
      }
    };

  const onSubmit = async ({
    hotel_name,
    phone_numbers,
    email_addresses,
    address,
  }: THotelValidate) => {
    try {
      setIsLoading(true);
      if (!rating) {
        setRatingError(true);
        toast.error("Rating can not be zero!");
        return;
      }
      if (usage === "create") {
        if (
          (await createHotel({
            hotel_name,
            chain_slug,
            phone_numbers,
            email_addresses,
            address,
            rating,
          })) === 1
        ) {
          toast.error("Hotel name or address already exists!");
        } else {
          toast.success(`Created ${hotel_name} successfully!`);
          router.back();
          router.refresh();
        }
      } else {
        if (
          (await updateHotel({
            hotel_name,
            chain_slug,
            phone_numbers,
            email_addresses,
            address,
            rating,
          })) === 1
        ) {
          toast.error("Address already exists!");
        } else {
          toast.success(`Updated ${hotel_name} successfully!`);
          router.back();
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
                <div className="flex justify-between">
                  <div className="grid gap-1 py-2 w-full">
                    <Label htmlFor="hotel_name">Hotel Name</Label>
                    <Input
                      {...register("hotel_name")}
                      className={cn({
                        "focus-visible:ring-red-500": errors.hotel_name,
                        "hover:cursor-not-allowed": usage === "edit",
                      })}
                      defaultValue={hotel?.hotel_name}
                      readOnly={usage === "edit"}
                      placeholder="Hotel Name"
                      type="text"
                    />
                    {errors?.hotel_name && (
                      <p className="text-sm text-red-500">
                        {errors.hotel_name.message?.toString()}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-1 py-2 w-full text-right">
                    <Label
                      htmlFor="rating"
                      className={cn({ "text-red-500": ratingError })}
                    >
                      Rating
                    </Label>
                    <Rating
                      className="ml-auto shrink-0"
                      size="large"
                      name="rating"
                      defaultValue={hotel?.rating || 0}
                      onChange={(event, newRating) => {
                        setRatingError(false);
                        setRating(newRating as number);
                      }}
                    />
                    {ratingError && (
                      <p className="text-sm text-red-500">
                        Rating can not be zero!
                      </p>
                    )}
                  </div>
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
                        defaultValue={hotel?.phone_numbers[index]}
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
                        defaultValue={hotel?.email_addresses[index]}
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
                  <Label htmlFor="address">Hotel Address</Label>
                  <Input
                    {...register("address")}
                    defaultValue={hotel?.address}
                    type="text"
                    className={cn({
                      "focus-visible:ring-red-500": errors.address,
                    })}
                    placeholder="123 Main St"
                  />
                  {errors?.address && (
                    <p className="text-sm text-red-500">
                      {errors.address.message?.toString()}
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
                      onClick={handleDelete(
                        hotel?.hotel_name,
                        hotel?.chain_slug
                      )}
                      disabled={isLoading}
                      variant="destructive"
                    >
                      {isLoading ? (
                        <div className="flex justify-center items-center">
                          <Loader2 className="animate-spin mr-3" />
                          <span>Loading</span>
                        </div>
                      ) : (
                        <p>Delete {hotel?.hotel_name}</p>
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
        Customers can not {usage} hotels
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

export default HotelForm;
