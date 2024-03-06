"use server";

import { createDatabaseClient } from "./database";

interface HotelChain {
  chain_name: string;
  phone_numbers: string[];
  email_addresses: string[];
  central_address: string;
  number_hotels?: number;
}

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
  const query = "SELECT * FROM hotel_chain WHERE chain_name = $1";
  const values = [chainName];
  const { rows } = await db.query(query, values);
  await db.end();
  return rows[0];
};

const updateHotelChain = async ({
  chain_name,
  phone_numbers,
  email_addresses,
  central_address,
}: HotelChain) => {
  const db = await createDatabaseClient();
  await db.connect();
  console.log(chain_name, phone_numbers, email_addresses, central_address);

  const searchQuery =
    "SELECT * FROM hotel_chain WHERE central_address = $1 AND chain_name != $2";
  const searchValues = [central_address, chain_name];
  const searchResult = await db.query(searchQuery, searchValues);

  // Throw an error if the chain name or central address already exists
  console.log(searchResult.rows);
  if (searchResult.rows?.length > 0) {
    return 1;
  }

  const query =
    "UPDATE hotel_chain SET phone_numbers = $2, email_addresses = $3, central_address = $4 WHERE chain_name = $1";
  const values = [chain_name, phone_numbers, email_addresses, central_address];
  await db.query(query, values);
  await db.end();
  return 0;
};

const createHotelChain = async ({
  chain_name,
  phone_numbers,
  email_addresses,
  central_address,
}: HotelChain) => {
  const db = await createDatabaseClient();
  await db.connect();

  const searchQuery =
    "SELECT * FROM hotel_chain WHERE chain_name = $1 OR central_address = $2";
  const searchValues = [chain_name, central_address];
  const searchResult = await db.query(searchQuery, searchValues);

  // Throw an error if the chain name or central address already exists
  if (searchResult.rows?.length > 0) {
    return 1;
  }

  const query = "INSERT INTO hotel_chain VALUES ($1, $2, $3, $4)";
  const values = [chain_name, phone_numbers, email_addresses, central_address];
  await db.query(query, values);
  await db.end();
  return 0;
};

const deleteHotelChain = async (chainName: string) => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "DELETE FROM hotel_chain WHERE chain_name = $1";
  const values = [chainName];
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
