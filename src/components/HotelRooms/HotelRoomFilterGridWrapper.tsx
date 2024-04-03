"use client";
import { useState } from "react";
import HotelRoomFilter from "./HotelRoomFilter";
import { HotelChain } from "@/lib/hotelChain";
import HotelRoomGrid from "./HotelRoomGrid";
import { HotelRoom } from "@/lib/hotelRoom";
import { Hotel } from "@/lib/hotel";
import { Booking } from "@/lib/booking";
import { getDatesBetween } from "@/lib/utils";

const HotelRoomFilterGridWrapper = ({
  hotelChains,
  hotels,
  bookings,
  hotelRooms,
}: {
  hotelChains: HotelChain[];
  hotels: Hotel[];
  bookings: Booking[];
  hotelRooms: HotelRoom[];
}) => {
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [capacity, setCapacity] = useState<string>();
  const [hotelChainSlug, setHotelChainSlug] = useState<string>();
  const [hotelRating, setHotelRating] = useState<number>();
  const [availableRooms, setAvailableRooms] = useState<number>();
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();
  const [priceError, setPriceError] = useState<string>();
  const filteredRooms = hotelRooms.filter((room) => {
    if (checkIn || checkOut) {
      if (checkIn) {
        const bookingsForRoom = bookings.filter(
          (booking) =>
            booking.room_number === room.room_number &&
            booking.hotel_slug === room.hotel_slug
        );
        const occupied = bookingsForRoom.some((booking) => {
          const bookedDates = getDatesBetween(
            booking.check_in,
            booking.check_out
          );
          return bookedDates.includes((checkIn as Date).toLocaleDateString());
        });
        if (occupied) {
          return false;
        }
      }
      if (checkOut) {
        const bookingsForRoom = bookings.filter(
          (booking) =>
            booking.room_number === room.room_number &&
            booking.hotel_slug === room.hotel_slug
        );
        const occupied = bookingsForRoom.some((booking) => {
          const bookedDates = getDatesBetween(
            booking.check_in,
            booking.check_out
          );
          return bookedDates.includes((checkOut as Date).toLocaleDateString());
        });
        if (occupied) {
          return false;
        }
      }
      if (checkIn && checkOut) {
        const bookingsForRoom = bookings.filter(
          (booking) =>
            booking.room_number === room.room_number &&
            booking.hotel_slug === room.hotel_slug
        );
        const occupied = bookingsForRoom.some((booking) => {
          const bookedDates = getDatesBetween(
            booking.check_in,
            booking.check_out
          );
          const datesBetween = getDatesBetween(
            checkIn as Date,
            checkOut as Date
          );
          return datesBetween.some((date) => bookedDates.includes(date));
        });
        if (occupied) {
          return false;
        }
      }
    }
    if (capacity && room.capacity !== capacity) {
      return false;
    }
    if (hotelChainSlug || hotelRating || availableRooms) {
      const hotel = hotels.find(
        (hotel) => hotel.hotel_slug === room.hotel_slug
      );
      if (hotelChainSlug && hotel?.chain_slug !== hotelChainSlug) {
        return false;
      }
      if (hotelRating && hotel?.rating !== hotelRating) {
        return false;
      }
      if (availableRooms) {
        let availableRoomsInHotel = 0;
        const roomsInHotel = hotelRooms.filter(
          (hotelRoom) => hotelRoom.hotel_slug === room.hotel_slug
        );
        roomsInHotel.forEach((room) => {
          const bookingsForRoom = bookings.filter(
            (booking) =>
              booking.room_number === room.room_number &&
              booking.hotel_slug === room.hotel_slug
          );
          const occupied = bookingsForRoom.some((booking) => {
            const bookedDates = getDatesBetween(
              booking.check_in,
              booking.check_out
            );
            return bookedDates.includes(new Date().toLocaleDateString());
          });
          if (!occupied) {
            availableRoomsInHotel += 1;
          }
        });
        if (availableRoomsInHotel < availableRooms) {
          return false;
        }
      }
    }

    if (
      room.price <= (minPrice as number) ||
      room.price >= (maxPrice as number)
    ) {
      return false;
    }
    return true;
  });
  return (
    <>
      <HotelRoomFilter
        hotelChains={hotelChains}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        capacity={capacity}
        setCapacity={setCapacity}
        hotelChainSlug={hotelChainSlug}
        setHotelChainSlug={setHotelChainSlug}
        hotelRating={hotelRating}
        setHotelRating={setHotelRating}
        availableRooms={availableRooms}
        setAvailableRooms={setAvailableRooms}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        priceError={priceError}
        setPriceError={setPriceError}
      />
      <HotelRoomGrid hotelRooms={filteredRooms} bookings={bookings} />
    </>
  );
};

export default HotelRoomFilterGridWrapper;
