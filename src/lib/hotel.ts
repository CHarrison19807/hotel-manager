"use server";

import slugify from "slugify";
import { createDatabaseClient } from "./database";
import { hotel } from "./utils";

const createHotel = async ({
  hotel_name,
  chain_slug,
  phone_numbers,
  email_addresses,
  address,
  rating,
}: hotel) => {
  const db = await createDatabaseClient();
  await db.connect();
  const hotelSlug = slugify(hotel_name, { lower: true });

  const searchQuery =
    "SELECT * FROM hotel WHERE (hotel_slug = $1 AND chain_slug = $2) OR (address = $3)";
  const searchValues = [hotelSlug, chain_slug, address];
  const searchResult = await db.query(searchQuery, searchValues);

  console.log(searchResult.rows);
  if (searchResult.rows?.length > 0) {
    return 1;
  }

  const query =
    "INSERT INTO hotel (hotel_name, hotel_slug, chain_slug, phone_numbers, email_addresses, address, rating) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  const values = [
    hotel_name,
    hotelSlug,
    chain_slug,
    phone_numbers,
    email_addresses,
    address,
    rating,
  ];
  console.log(values);
  await db.query(query, values);
  await db.end();
  return 0;
};

const getHotel = async (chainSlug: string) => {
  const db = await createDatabaseClient();
  await db.connect();

  const query = "SELECT * FROM hotel WHERE chain_slug = $1";
  const values = [chainSlug];
  const result = await db.query(query, values);

  await db.end();
  return result.rows;
};

const getSingleHotel = async (hotelName: string, chainSlug: string) => {
  const db = await createDatabaseClient();
  await db.connect();
  const hotelSlug = slugify(hotelName, { lower: true });
  const query = "SELECT * FROM hotel WHERE hotel_slug = $1 AND chain_slug = $2";
  const values = [hotelSlug, chainSlug];
  const result = await db.query(query, values);

  await db.end();
  return result.rows[0];
};

const updateHotel = async ({
  hotel_name,
  chain_slug,
  phone_numbers,
  email_addresses,
  address,
  rating,
}: hotel) => {
  const db = await createDatabaseClient();
  await db.connect();
  const hotelSlug = slugify(hotel_name, { lower: true });

  const searchQuery =
    "SELECT * FROM hotel WHERE address = $1 AND hotel_slug != $2";
  const searchValues = [address, hotelSlug];
  const searchResult = await db.query(searchQuery, searchValues);

  if (searchResult.rows?.length > 0) {
    return 1;
  }
  const query =
    "UPDATE hotel SET phone_numbers = $3, email_addresses = $4, address = $5, rating = $6 WHERE hotel_slug = $1 AND chain_slug = $2";
  const values = [
    hotelSlug,
    chain_slug,
    phone_numbers,
    email_addresses,
    address,
    rating,
  ];
  await db.query(query, values);
  await db.end();
  return 0;
};

const deleteHotel = async (hotelName: string, chainSlug: string) => {
  const db = await createDatabaseClient();
  await db.connect();
  const hotelSlug = slugify(hotelName, { lower: true });
  const query = "DELETE FROM hotel WHERE hotel_slug = $1 AND chain_slug = $2";
  const values = [hotelSlug, chainSlug];
  await db.query(query, values);
  await db.end();
};

export { createHotel, getHotel, getSingleHotel, updateHotel, deleteHotel };
