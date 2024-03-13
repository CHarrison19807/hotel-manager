import { createDatabaseClient } from "./database";
import { hotel_room } from "./utils";

const createhotelRoom = async ({
  room_number,
  hotel_slug,
  price,
  damages,
  amenities,
  occupied,
  extended,
  capacity,
}: hotel_room) => {
  const db = await createDatabaseClient();
  const searchQuery =
    "SELECT * FROM hotel_room WHERE room_number = $1 AND hotel_slug = $2";
  const searchValues = [room_number, hotel_slug];
  const searchResult = await db.query(searchQuery, searchValues);

  if (searchResult.rows?.length > 0) {
    return 1;
  }

  const query =
    "INSERT INTO hotel_room (room_number, hotel_slug, price, damages, amenities, occupied, extended, capacity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
  const values = [
    room_number,
    hotel_slug,
    price,
    damages,
    amenities,
    occupied,
    extended,
    capacity,
  ];
  await db.query(query, values);
  await db.end();
  return 0;
};

const getHotelRooms = async (hotel_slug: string) => {
  const db = await createDatabaseClient();
  const query = "SELECT * FROM hotel_room WHERE hotel_slug = $1";
  const values = [hotel_slug];
  const { rows } = await db.query(query, values);
  await db.end();
  return rows;
};

const getSingleRoom = async (hotel_slug: string, room_number: number) => {
  const db = await createDatabaseClient();
  const query =
    "SELECT * FROM hotel_room WHERE hotel_slug = $1 AND room_number = $2";
  const values = [hotel_slug, room_number];
  const { rows } = await db.query(query, values);
  await db.end();
  return rows[0];
};

const getAllRooms = async () => {
  const db = await createDatabaseClient();
  const query = "SELECT * FROM hotel_room";
  const { rows } = await db.query(query);
  await db.end();
  return rows;
};

const updateHotelRoom = async ({
  room_number,
  hotel_slug,
  price,
  damages,
  amenities,
  occupied,
  extended,
  capacity,
}: hotel_room) => {
  const db = await createDatabaseClient();
  const searchQuery =
    "SELECT * FROM hotel_room WHERE room_number = $1 AND hotel_slug = $2";
  const searchValues = [room_number, hotel_slug];
  const searchResult = await db.query(searchQuery, searchValues);

  if (searchResult.rows?.length > 0) {
    return 1;
  }
  const query =
    "UPDATE hotel_room SET price = $3, damages = $4, amenities = $5, occupied = $6, extended = $7, capacity = $8 WHERE room_number = $1 AND hotel_slug = $2";
  const values = [
    room_number,
    hotel_slug,
    price,
    damages,
    amenities,
    occupied,
    extended,
    capacity,
  ];
  await db.query(query, values);
  await db.end();
  return 0;
};

const deleteHotelRoom = async (hotel_slug: string, room_number: number) => {
  const db = await createDatabaseClient();
  const query =
    "DELETE FROM hotel_room WHERE hotel_slug = $1 AND room_number = $2";
  const values = [hotel_slug, room_number];
  await db.query(query, values);
  await db.end();
};
