"use server";

import slugify from "slugify";
import { createDatabaseClient } from "./database";
import { hotel_chain } from "./utils";

const getHotelChains = async () => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM hotel_chain";
  const { rows } = await db.query(query);
  await db.end();
  return rows;
};

const getSingleHotelChain = async (chainName: string) => {
  const db = await createDatabaseClient();
  await db.connect();
  const chainSlug = slugify(chainName, { lower: true });
  const query = "SELECT * FROM hotel_chain WHERE chain_slug = $1";
  const values = [chainSlug];
  const { rows } = await db.query(query, values);
  await db.end();
  return rows[0];
};

const updateHotelChain = async ({
  chain_name,
  phone_numbers,
  email_addresses,
  central_address,
}: hotel_chain) => {
  const db = await createDatabaseClient();
  await db.connect();
  const slug = slugify(chain_name, { lower: true });
  const searchQuery =
    "SELECT * FROM hotel_chain WHERE central_address = $1 AND chain_slug != $2";
  const searchValues = [central_address, slug];
  const searchResult = await db.query(searchQuery, searchValues);

  // Throw an error if the chain name or central address already exists
  if (searchResult.rows?.length > 0) {
    return 1;
  }

  const query =
    "UPDATE hotel_chain SET phone_numbers = $2, email_addresses = $3, central_address = $4 WHERE chain_slug = $1";
  const values = [slug, phone_numbers, email_addresses, central_address];
  await db.query(query, values);
  await db.end();
  return 0;
};

const createHotelChain = async ({
  chain_name,
  phone_numbers,
  email_addresses,
  central_address,
}: hotel_chain) => {
  const db = await createDatabaseClient();
  await db.connect();
  const slug = slugify(chain_name, { lower: true });

  const searchQuery =
    "SELECT * FROM hotel_chain WHERE chain_slug = $1 OR central_address = $2";
  const searchValues = [slug, central_address];
  const searchResult = await db.query(searchQuery, searchValues);

  // Throw an error if the chain name or central address already exists
  if (searchResult.rows?.length > 0) {
    return 1;
  }

  const query =
    "INSERT INTO hotel_chain (chain_slug, chain_name, phone_numbers, email_addresses, central_address)  VALUES ($1, $2, $3, $4, $5)";
  const values = [
    slug,
    chain_name,
    phone_numbers,
    email_addresses,
    central_address,
  ];
  await db.query(query, values);
  await db.end();
  return 0;
};

const deleteHotelChain = async (chainName: string) => {
  const db = await createDatabaseClient();
  await db.connect();
  const slug = slugify(chainName, { lower: true });

  const query = "DELETE FROM hotel_chain WHERE chain_slug = $1";
  const values = [slug];
  await db.query(query, values);
  await db.end();
};

export {
  getHotelChains,
  getSingleHotelChain,
  updateHotelChain,
  createHotelChain,
  deleteHotelChain,
};
