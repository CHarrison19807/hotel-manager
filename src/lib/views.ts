import { createDatabaseClient } from "./database";

export type RoomCount = {
  rating: number;
  count: number;
};

export type HotelCapacity = {
  hotel_name: string;
  total_capacity: number;
};

const roomsByRating = async (): Promise<RoomCount[]> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM available_rooms_by_rating;";
  const result = await db.query(query);
  await db.end();
  return result.rows;
};

const hotelCapacity = async (): Promise<HotelCapacity[]> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM hotel_capacity;";
  const result = await db.query(query);
  await db.end();
  return result.rows;
};

export { roomsByRating, hotelCapacity };
