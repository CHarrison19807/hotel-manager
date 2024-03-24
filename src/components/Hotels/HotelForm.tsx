"use client";
import { Hotel, deleteHotel } from "@/lib/hotel";
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

import { THotelValidate, hotelValidate } from "@/lib/validators/hotelValidator";
import { createHotel, updateHotel } from "@/lib/hotel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import slugify from "slugify";
import { HotelChain } from "@/lib/hotelChain";
import FormWrapper from "../FormWrapper";
import {
  getServerSideUser,
  isManagerAtHotel,
  logoutUser,
  setUser,
} from "@/lib/user";
import { time } from "console";
import { Employee } from "@/lib/employee";

interface HotelFormProps {
  hotelChains: HotelChain[];
  hotel?: Hotel;
}

const HotelForm = (props: HotelFormProps) => {
  const { hotel, hotelChains } = props;
  const {
    hotel_slug,
    hotel_name,
    phone_numbers,
    email_addresses,
    address,
    rating,
    chain_slug,
  } = hotel ?? {};

  const form = useForm<THotelValidate>({
    defaultValues: {
      hotel_name: hotel_name || "",
      address: address || "",
      rating,
      chain_slug: chain_slug || "",
    },
    resolver: zodResolver(hotelValidate),
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

  const { handleSubmit, control } = form;

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (data: THotelValidate) => {
    setIsLoading(true);
    if (hotel) {
      const newHotel = {
        ...data,
        hotel_slug: slugify(data.hotel_name, { lower: true }),
      };

      if (
        await isManagerAtHotel(slugify(hotel_name as string, { lower: true }))
      ) {
        const result = await updateHotel(newHotel, hotel.hotel_name);
        if (result) {
          toast.error(result);
        } else {
          toast.success("Hotel Updated Successfully!");
          if (hotel.hotel_name !== newHotel.hotel_name) {
            const user: Employee = (await getServerSideUser()) as Employee;
            const newUser: Employee = {
              ...user,
              hotel_slug: newHotel.hotel_slug,
            };
            await setUser(newUser as Employee);
          }
          router.push("/admin/hotels");
          router.refresh();
        }
      } else {
        toast.error("You are not authorized to perform this action!");
      }
    } else {
      const result = await createHotel(data);
      if (result) {
        toast.error(result);
      } else {
        toast.success("Hotel Created Successfully!");
        router.push("/admin/hotels");
        router.refresh();
      }
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    if (await isManagerAtHotel(hotel_slug as string)) {
      const result = await deleteHotel(hotel_slug as string);
      if (result) {
        toast.error(result);
      } else {
        toast.success("Hotel Deleted Successfully");
        router.push("/admin/hotels");
        router.refresh();
      }
    } else {
      toast.error("You are not authorized to perform this action!");
    }
    setIsLoading(false);
  };
  return (
    <FormWrapper headerText={hotel ? "Edit Hotel" : "Create Hotel"}>
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="chain_slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Chain</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={hotel?.chain_slug}
                      disabled={hotel?.chain_slug ? true : false}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Hotel Chain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hotelChains.map((hotelChain) => (
                          <SelectItem
                            key={slugify(hotelChain.chain_name, {
                              lower: true,
                            })}
                            value={slugify(hotelChain.chain_name, {
                              lower: true,
                            })}
                          >
                            {hotelChain.chain_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="hotel_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Hotel Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={rating?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
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
                    control={control}
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
                control={control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
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
                {hotel && (
                  <Button
                    type="button"
                    onClick={() => handleDelete()}
                    disabled={isLoading}
                    variant="destructive"
                  >
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <Loader2 className="animate-spin mr-3" />
                        <span>Loading</span>
                      </div>
                    ) : (
                      <p>Delete {hotel_name}</p>
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

export default HotelForm;
