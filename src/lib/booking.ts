"use server";

import { createDatabaseClient } from "./database";
import { getSingleHotelRoom } from "./hotelRoom";
import { generateID } from "./utils";

export type Booking = {
  booking_id?: string;
  customer_sin: string;
  hotel_slug: string;
  room_number: number;
  check_in: Date;
  check_out: Date;
  total_cost: number;
  is_renting?: boolean;
};

export type BookedDates = {
  check_in: Date;
  check_out: Date;
};

const createBooking = async (booking: Booking): Promise<string> => {
  const db = await createDatabaseClient();

  try {
    const {
      booking_id,
      customer_sin,
      hotel_slug,
      room_number,
      check_in,
      check_out,
      total_cost,
    } = booking;
    await db.connect();

    const hotelRoom = await getSingleHotelRoom(hotel_slug, room_number);
    if (!hotelRoom) {
      return "There is no room with that number in the hotel!";
    }

    const bookings = await getBookingsBetweenDates(check_in, check_out);
    for (const booking of bookings) {
      if (
        booking.hotel_slug === hotel_slug &&
        booking.room_number === room_number
      ) {
        return "The room is already booked for the selected dates!";
      }
    }

    let new_booking_id = "";
    if (!booking_id) {
      let uniqueID = false;
      while (!uniqueID) {
        new_booking_id = generateID();
        const searchQuery = "SELECT * FROM booking WHERE booking_id = $1;";

        const searchValues = [new_booking_id];
        const results = await db.query(searchQuery, searchValues);
        if (results.rows.length === 0) {
          uniqueID = true;
        }
      }
    }

    const query = `INSERT INTO booking (booking_id, customer_sin, hotel_slug, room_number, check_in, check_out, total_cost, is_renting) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
    const values = [
      booking_id ? booking_id : new_booking_id,
      customer_sin,
      hotel_slug,
      room_number,
      check_in,
      check_out,
      total_cost,
      check_in <= new Date(),
    ];
    await db.query(query, values);
  } catch (error) {
    console.error(error);
    return "Unexpected error while creating booking! Please try again.";
  } finally {
    await db.end();
  }

  return "";
};

const getAllBookings = async (): Promise<Booking[]> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM booking;";
  const results = await db.query(query);
  await db.end();
  return results.rows;
};

const getBookingsBetweenDates = async (
  check_in: Date,
  check_out: Date
): Promise<Booking[]> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query =
    "SELECT * FROM booking WHERE (check_in >= $1 AND check_in <= $2) OR (check_out <= $2 AND check_out >= $1);";
  const values = [check_in, check_out];
  const results = await db.query(query, values);
  await db.end();
  return results.rows;
};

const getCustomerBookings = async (
  customer_sin: string
): Promise<Booking[]> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM booking WHERE customer_sin = $1;";
  const values = [customer_sin];
  const results = await db.query(query, values);
  await db.end();
  return results.rows;
};

const getBookedDates = async (room_number: number, hotel_slug: string) => {
  const db = await createDatabaseClient();
  await db.connect();
  const query =
    "SELECT check_in, check_out FROM booking WHERE room_number = $1 AND hotel_slug = $2;";
  const values = [room_number, hotel_slug];
  const results = await db.query(query, values);
  await db.end();
  return results.rows;
};

const getBooking = async (booking_id: string): Promise<Booking> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM booking WHERE booking_id = $1;";
  const values = [booking_id];
  const results = await db.query(query, values);
  await db.end();
  return results.rows[0];
};

const updateBooking = async (booking: Booking): Promise<string> => {
  const db = await createDatabaseClient();
  try {
    await db.connect();
    const {
      booking_id,
      customer_sin,
      hotel_slug,
      room_number,
      check_in,
      check_out,
      total_cost,
      is_renting,
    } = booking;
    const query = `UPDATE booking SET customer_sin = $1, hotel_slug = $2, room_number = $3, check_in = $4, check_out = $5, total_cost = $6, is_renting = $8 WHERE booking_id = $7;`;
    const values = [
      customer_sin,
      hotel_slug,
      room_number,
      check_in,
      check_out,
      total_cost,
      booking_id,
      is_renting,
    ];
    await db.query(query, values);
  } catch (error) {
    console.error(error);
    return "Unexpected error while updating booking! Please try again.";
  } finally {
    await db.end();
  }
  return "";
};

const deleteBooking = async (booking_id: string): Promise<string> => {
  const db = await createDatabaseClient();

  try {
    await db.connect();
    const query = "DELETE FROM booking WHERE booking_id = $1;";
    const values = [booking_id];
    await db.query(query, values);
  } catch (error) {
    console.error(error);
    return "Unexpected error while deleting booking! Please try again.";
  } finally {
    await db.end();
  }
  return "";
};

export {
  createBooking,
  getAllBookings,
  getCustomerBookings,
  getBooking,
  getBookedDates,
  getBookingsBetweenDates,
  updateBooking,
  deleteBooking,
};
