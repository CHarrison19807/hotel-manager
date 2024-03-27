"use client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { HotelChain } from "@/lib/hotelChain";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

interface HotelRoomFilterProps {
  hotelChains: HotelChain[];
  checkIn?: Date;
  checkOut?: Date;
  capacity?: string;
  hotelChainSlug?: string;
  hotelRating?: number;
  availableRooms?: number;
  minPrice?: number;
  maxPrice?: number;
  priceError?: string;
  setCheckIn: (date: Date | undefined) => void;
  setCheckOut: (date: Date | undefined) => void;
  setCapacity: (capacity: string) => void;
  setHotelChainSlug: (slug: string | undefined) => void;
  setHotelRating: (rating: number) => void;
  setAvailableRooms: (rooms: number) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setPriceError(message: string): void;
}

const HotelRoomFilter = (props: HotelRoomFilterProps) => {
  const {
    hotelChains,
    checkIn,
    checkOut,
    hotelChainSlug,
    availableRooms,
    minPrice,
    maxPrice,
    priceError,
    setCapacity,
    setCheckIn,
    setCheckOut,
    setAvailableRooms,
    setHotelChainSlug,
    setHotelRating,
    setMaxPrice,
    setMinPrice,
    setPriceError,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center">
        <Button
          className="text-2xl mb-8 mx-auto w-full max-w-[325px]"
          onClick={() => setIsOpen(!isOpen)}
        >
          Find your ideal room
        </Button>
      </div>
      {isOpen && (
        <div className="grid gap-2 lg:grid-cols-4 pb-16">
          <div className="flex flex-col gap-1.5 mx-auto">
            <Label htmlFor="checkIn">Check in date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[225px] pl-3 text-left font-normal",
                    !checkIn && "text-muted-foreground"
                  )}
                  id="checkIn"
                >
                  {checkIn ? (
                    format(checkIn, "PPP")
                  ) : (
                    <span>Pick your check in date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={(date) => setCheckIn(date)}
                  disabled={(date) =>
                    date > new Date("2030-01-01") ||
                    date < new Date() ||
                    date > (checkOut as Date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5 mx-auto">
            <Label htmlFor="checkOut">Check out date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[225px] pl-3 text-left font-normal",
                    !checkOut && "text-muted-foreground"
                  )}
                  id="checkOut"
                >
                  {checkOut ? (
                    format(checkOut, "PPP")
                  ) : (
                    <span>Pick your check out date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={(date) => setCheckOut(date)}
                  disabled={(date) =>
                    date > new Date("2030-01-01") ||
                    date < new Date() ||
                    date < (checkIn as Date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5 w-[225px] mx-auto">
            <Label htmlFor="capacity">Room capacity</Label>
            <Select onValueChange={(value) => setCapacity(value)}>
              <SelectTrigger id="capacity">
                <SelectValue placeholder="Select a capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="double">Double</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-y-1.5 w-[225px] row-span-2 mx-auto">
            {priceError && (
              <p className="text-red-500 text-sm font-medium">{priceError}</p>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="minPrice">Minimum price</Label>
              <Input
                placeholder="100"
                type="number"
                id="minPrice"
                defaultValue={minPrice || ""}
                onChange={(e) => {
                  if (maxPrice && parseInt(e.target.value) > maxPrice) {
                    setPriceError(
                      "Minimum price must be less than maximum price!"
                    );
                    return;
                  }
                  setPriceError("");
                  setMinPrice(parseInt(e.target.value));
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5 w-[225px]">
              <Label htmlFor="maxPrice">Maximum price</Label>
              <Input
                placeholder="1000"
                type="number"
                id="maxPrice"
                defaultValue={maxPrice || ""}
                onChange={(e) => {
                  if (minPrice && parseInt(e.target.value) < minPrice) {
                    setPriceError(
                      "Minimum price must be less than maximum price!"
                    );
                    return;
                  }
                  setPriceError("");
                  setMaxPrice(parseInt(e.target.value));
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-[225px] mx-auto">
            <Label htmlFor="hotelChain">Hotel Chain</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="justify-between font-normal"
                  id="hotelChain"
                >
                  {hotelChainSlug
                    ? `${
                        hotelChains.find(
                          (hotelChain) =>
                            hotelChain.chain_slug === hotelChainSlug
                        )?.chain_name
                      }`
                    : "Select hotel chain"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[375px]">
                <Command>
                  <CommandInput placeholder="Search hotel chains..." />
                  <CommandEmpty>No hotel chains found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      <CommandItem onSelect={() => setHotelChainSlug("")}>
                        <Check className={cn("mr-2 h-4 w-4 opacity-0")} />
                        Clear Selection
                      </CommandItem>
                      {hotelChains.map((hotelChain) => (
                        <CommandItem
                          value={hotelChain.chain_slug}
                          key={hotelChain.chain_slug}
                          onSelect={() => {
                            setHotelChainSlug(hotelChain.chain_slug);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              hotelChain.chain_slug === hotelChainSlug
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {hotelChain.chain_name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5 w-[225px] mx-auto">
            <Label htmlFor="hotelRating">Hotel rating</Label>
            <Select onValueChange={(value) => setHotelRating(parseInt(value))}>
              <SelectTrigger id="hotelRating">
                <SelectValue placeholder="Select a rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5 w-[225px] mx-auto">
            <Label htmlFor="availableRooms">
              Minimum available rooms in hotel
            </Label>
            <Input
              placeholder="3"
              type="number"
              id="availableRooms"
              value={availableRooms || ""}
              onChange={(e) => setAvailableRooms(parseInt(e.target.value))}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default HotelRoomFilter;
