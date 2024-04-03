"use server";

import { createDatabaseClient } from "./database";

export type HotelRoom = {
  room_number: number;
  hotel_slug: string;
  price: number;
  damages?: string[];
  amenities?: string[];
  extended: boolean;
  capacity: "single" | "double" | "suite";
  view: "pool" | "city" | "mountain" | "ocean" | "garden";
};

const createHotelRoom = async (hotelRoom: HotelRoom): Promise<string> => {
  const db = await createDatabaseClient();
  try {
    await db.connect();
    const {
      room_number,
      hotel_slug,
      price,
      damages,
      amenities,
      extended,
      capacity,
      view,
    } = hotelRoom;

    const searchQuery =
      "SELECT * FROM hotel_room WHERE room_number = $1 AND hotel_slug = $2";
    const searchValues = [room_number, hotel_slug];
    const searchResult = await db.query(searchQuery, searchValues);

    if (searchResult.rows?.length > 0) {
      return "A hotel room with the same room number already exists.";
    }

    const query =
      "INSERT INTO hotel_room (room_number, hotel_slug, price, damages, amenities, extended, capacity, view) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    const values = [
      room_number,
      hotel_slug,
      price,
      damages,
      amenities,
      extended,
      capacity,
      view,
    ];
    await db.query(query, values);
  } catch (error) {
    console.error(error);
    return "Unexpected error occurred while creating hotel room. Please try again.";
  } finally {
    await db.end();
  }
  return "";
};

const getHotelRooms = async (hotel_slug: string): Promise<HotelRoom[]> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM hotel_room where hotel_slug = $1";
  const values = [hotel_slug];
  const { rows } = await db.query(query, values);
  await db.end();
  return rows;
};

const getSingleHotelRoom = async (
  hotel_slug: string,
  room_number: number
): Promise<HotelRoom> => {
  const db = await createDatabaseClient();
  await db.connect();

  const query =
    "SELECT * FROM hotel_room WHERE hotel_slug = $1 AND room_number = $2";
  const values = [hotel_slug, room_number];
  const { rows } = await db.query(query, values);
  await db.end();

  return rows[0];
};

const getAllHotelRooms = async (): Promise<HotelRoom[]> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM hotel_room";
  const { rows } = await db.query(query);
  await db.end();
  return rows;
};

const updateHotelRoom = async (hotelRoom: HotelRoom): Promise<string> => {
  const db = await createDatabaseClient();
  try {
    await db.connect();
    const {
      room_number,
      hotel_slug,
      price,
      damages,
      amenities,
      extended,
      capacity,
      view,
    } = hotelRoom;

    const searchQuery =
      "SELECT * FROM hotel_room WHERE room_number = $1 AND hotel_slug = $2";
    const searchValues = [room_number, hotel_slug];
    const searchResult = await db.query(searchQuery, searchValues);

    if (searchResult.rows?.length > 1) {
      return "A hotel room with the same room number already exists.";
    }
    const query =
      "UPDATE hotel_room SET price = $3, damages = $4, amenities = $5, extended = $6, capacity = $7, view = $8 WHERE room_number = $1 AND hotel_slug = $2";
    const values = [
      room_number,
      hotel_slug,
      price,
      damages,
      amenities,
      extended,
      capacity,
      view,
    ];
    await db.query(query, values);
  } catch (error) {
    console.error(error);
    return "Unexpected error occurred while updating hotel room. Please try again.";
  } finally {
    await db.end();
  }

  return "";
};

const deleteHotelRoom = async (
  hotel_slug: string,
  room_number: number
): Promise<string> => {
  const db = await createDatabaseClient();
  try {
    await db.connect();

    const query =
      "DELETE FROM hotel_room WHERE hotel_slug = $1 AND room_number = $2";
    const values = [hotel_slug, room_number];
    await db.query(query, values);
  } catch (error) {
    console.error(error);
    return "Unexpected error occurred while deleting hotel room. Please try again.";
  } finally {
    await db.end();
  }
  return "";
};

export {
  createHotelRoom,
  getHotelRooms,
  getSingleHotelRoom,
  getAllHotelRooms,
  updateHotelRoom,
  deleteHotelRoom,
};
