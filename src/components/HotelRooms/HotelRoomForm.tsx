"use client";

import { Hotel } from "@/lib/hotel";
import {
  HotelRoom,
  createHotelRoom,
  deleteHotelRoom,
  updateHotelRoom,
} from "@/lib/hotelRoom";
import FormWrapper from "../FormWrapper";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { UseFormReturn, useForm } from "react-hook-form";
import {
  HotelRoomValidator,
  THotelRoomValidator,
} from "@/lib/validators/hotelRoomValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "../ui/switch";
import {
  HOTEL_ROOM_AMENITY_OPTIONS,
  HOTEL_ROOM_DAMAGE_OPTIONS,
  cn,
  generateID,
} from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { isManagerAtHotel } from "@/lib/user";
import { toast } from "sonner";

interface HotelRoomFormProps {
  hotels: Hotel[];
  hotelRoom?: HotelRoom;
}

const HotelRoomForm = (props: HotelRoomFormProps) => {
  const { hotels, hotelRoom } = props;
  const {
    capacity,
    extended,
    hotel_slug,
    price,
    room_number,
    amenities,
    damages,
    view,
  } = hotelRoom ?? {};

  const form: UseFormReturn<THotelRoomValidator> = useForm<THotelRoomValidator>(
    {
      defaultValues: {
        capacity,
        extended: extended ?? false,
        hotel_slug,
        // @ts-expect-error
        price: price ?? "",
        view,
        // @ts-expect-error
        room_number: room_number ?? "",
        amenities,
        damages,
      },
      resolver: zodResolver(HotelRoomValidator),
    }
  );

  const initialDamagesCount = damages?.length || 1;
  const initialAmenitiesCount = amenities?.length || 1;

  const damagesArray = Array.from(
    { length: initialDamagesCount },
    (_, index) => index
  );
  const amenitiesArray = Array.from(
    { length: initialAmenitiesCount },
    (_, index) => index
  );

  const [damagesCount, setDamagesCount] = useState(damagesArray || [0]);
  const [amenitiesCount, setAmenitiesCount] = useState(amenitiesArray || [0]);

  const handleAddDamage = () => {
    if (damagesCount.length === 0) {
      setDamagesCount([0]);
    } else {
      setDamagesCount([
        ...damagesCount,
        damagesCount[damagesCount.length - 1] + 1,
      ]);
    }
  };

  const handleAddAmenity = () => {
    if (amenitiesCount.length === 0) {
      setAmenitiesCount([0]);
    } else {
      setAmenitiesCount([
        ...amenitiesCount,
        amenitiesCount[amenitiesCount.length - 1] + 1,
      ]);
    }
  };

  const handleRemoveDamage = () => {
    const index = damagesCount[damagesCount.length - 1];
    if (damagesCount.length > 1) {
      setDamagesCount(damagesCount.slice(0, -1));
      form.setValue(`damages.${index}`, "");
    } else {
      setDamagesCount([]);
      form.setValue(`damages`, []);
    }
  };

  const handleRemoveAmenity = () => {
    const index = amenitiesCount[amenitiesCount.length - 1];
    if (amenitiesCount.length > 1) {
      setAmenitiesCount(amenitiesCount.slice(0, -1));
      form.setValue(`amenities.${index}`, "");
    } else {
      setAmenitiesCount([]);
      form.setValue(`amenities`, []);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const onSubmit = async (data: THotelRoomValidator) => {
    setIsLoading(true);
    if (await isManagerAtHotel(data.hotel_slug)) {
      if (hotelRoom) {
        const result = await updateHotelRoom(data);
        if (result) {
          toast.error(result);
        } else {
          toast.success("Room updated successfully!");
          router.push("/admin/hotel-rooms");
          router.refresh();
        }
      } else {
        const result = await createHotelRoom(data);
        if (result) {
          toast.error(result);
        } else {
          toast.success("Room created successfully!");
          router.push("/admin/hotel-rooms");
          router.refresh();
        }
      }
    } else {
      toast.error("You are not authorized to perform this action!");
    }
    setIsLoading(false);
  };
  const handleDelete = async () => {
    setIsLoading(true);
    if (await isManagerAtHotel(hotel_slug as string)) {
      const result = await deleteHotelRoom(
        hotel_slug as string,
        room_number as number
      );
      if (result) {
        toast.error(result);
      } else {
        toast.success("Room deleted successfully!");
        router.push("/admin/hotel-rooms");
        router.refresh();
      }
    } else {
      toast.error("You are not authorized to perform this action!");
    }
    setIsLoading(false);
  };
  return (
    <FormWrapper
      headerText={hotelRoom ? "Edit Hotel Room" : "Create Hotel Room"}
    >
      <div className="flex justify-around mb-6">
        <div className="flex flex-col">
          <Button variant="ghost" type="button" onClick={handleAddDamage}>
            <p>Add Damage </p>
          </Button>
          <Button
            disabled={damagesCount.length === 0}
            variant="ghost"
            type="button"
            onClick={handleRemoveDamage}
          >
            <p>Remove Damage</p>
          </Button>
        </div>

        <div className="flex flex-col">
          <Button variant="ghost" type="button" onClick={handleAddAmenity}>
            <p>Add Amenity</p>
          </Button>
          <Button
            disabled={amenitiesCount.length === 0}
            variant="ghost"
            type="button"
            onClick={handleRemoveAmenity}
          >
            <p>Remove Amenity</p>
          </Button>
        </div>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="hotel_slug"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Hotel</FormLabel>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        disabled={hotelRoom ? true : false}
                      >
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="justify-between font-normal"
                          >
                            {field.value
                              ? `${
                                  hotels.find(
                                    (hotel) => hotel.hotel_slug === field.value
                                  )?.hotel_name
                                }`
                              : "Select hotel"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[375px]">
                        <Command>
                          <CommandInput placeholder="Search hotels..." />
                          <CommandEmpty>No hotels found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {hotels.map((hotel) => (
                                <CommandItem
                                  value={hotel.hotel_slug}
                                  key={hotel.hotel_slug}
                                  onSelect={() => {
                                    form.setValue(
                                      "hotel_slug",
                                      hotel.hotel_slug as string
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      hotel.hotel_slug === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {hotel.hotel_name}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="room_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input placeholder="101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={capacity}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a capacity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>View</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={view}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a view" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="city">City</SelectItem>
                        <SelectItem value="garden">Garden</SelectItem>
                        <SelectItem value="mountain">Mountain</SelectItem>
                        <SelectItem value="ocean">Ocean</SelectItem>
                        <SelectItem value="pool">Pool</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {damagesCount.map((index: number) => {
                return (
                  <FormField
                    key={generateID()}
                    control={form.control}
                    name={`damages.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Damage</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="justify-between font-normal"
                              >
                                {field.value
                                  ? `${HOTEL_ROOM_DAMAGE_OPTIONS.find(
                                      (damage) => damage === field.value
                                    )}`
                                  : "Select damage"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-[375px]">
                            <Command>
                              <CommandInput placeholder="Search damages..." />
                              <CommandEmpty>No damages found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {HOTEL_ROOM_DAMAGE_OPTIONS.map((damage) => (
                                    <CommandItem
                                      value={damage}
                                      key={damage}
                                      onSelect={() => {
                                        form.setValue(
                                          `damages.${index}`,
                                          damage
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          damage === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {damage}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}

              {amenitiesCount.map((index: number) => {
                return (
                  <FormField
                    key={generateID()}
                    control={form.control}
                    name={`amenities.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Amenity</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="justify-between font-normal"
                              >
                                {field.value
                                  ? `${HOTEL_ROOM_AMENITY_OPTIONS.find(
                                      (amenity) => amenity === field.value
                                    )}`
                                  : "Select amenity"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-[375px]">
                            <Command>
                              <CommandInput placeholder="Search customers..." />
                              <CommandEmpty>No customers found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {HOTEL_ROOM_AMENITY_OPTIONS.map((amenity) => (
                                    <CommandItem
                                      value={amenity}
                                      key={amenity}
                                      onSelect={() => {
                                        form.setValue(
                                          `amenities.${index}`,
                                          amenity
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          amenity === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {amenity}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}

              <FormField
                control={form.control}
                name="extended"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Room can be Extended
                      </FormLabel>
                      <FormDescription>
                        Can this room be extended?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="100.00" {...field} />
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
                {hotelRoom && (
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
                      <p>Delete Room {room_number}</p>
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

export default HotelRoomForm;
