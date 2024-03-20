/**
 * @fileOverview This file contains functions related to hotel chains.
 */

"use server";

import slugify from "slugify";
import { createDatabaseClient } from "./database";

/**
 * Represents a hotel chain.
 */
export type HotelChain = {
  chain_name: string;
  chain_slug?: string;
  phone_numbers: string[];
  email_addresses: string[];
  central_address: string;
  number_hotels?: number;
};

/**
 * Creates a new hotel chain.
 * @param chain_name - The name of the hotel chain.
 * @param phone_numbers - An array of phone numbers associated with the hotel chain.
 * @param email_addresses - An array of email addresses associated with the hotel chain.
 * @param central_address - The central address of the hotel chain.
 * @returns A promise that resolves to an empty string if the hotel chain is created successfully, or an error message if an error occurs.
 */
const createHotelChain = async (hotelChain: HotelChain): Promise<string> => {
  const db = await createDatabaseClient();

  try {
    const { chain_name, phone_numbers, email_addresses, central_address } =
      hotelChain;
    await db.connect();
    const slug = slugify(chain_name, { lower: true });

    const searchQuery =
      "SELECT * FROM hotel_chain WHERE chain_slug = $1 OR central_address = $2";
    const searchValues = [slug, central_address];
    const searchResult = await db.query(searchQuery, searchValues);

    if (searchResult.rows?.length > 0) {
      if (searchResult.rows[0].chain_slug === slug)
        return "Hotel chain already exists!";
      if (searchResult.rows[0].central_address === central_address)
        return "Central address already exists!";
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
  } catch (error) {
    return "Unexpected error occurred while creating hotel chain. Please try again.";
  } finally {
    await db.end();
  }
  return "";
};

/**
 * Retrieves all hotel chains.
 * @returns A promise that resolves to an array of hotel chains.
 */
const getAllHotelChains = async (): Promise<HotelChain[]> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM hotel_chain";
  const { rows } = await db.query(query);
  await db.end();
  return rows;
};

/**
 * Retrieves a single hotel chain by its name.
 * @param chainName - The name of the hotel chain.
 * @returns A promise that resolves to the hotel chain object.
 */
const getSingleHotelChain = async (chainName: string): Promise<HotelChain> => {
  const db = await createDatabaseClient();
  await db.connect();
  const chainSlug = slugify(chainName, { lower: true });
  const query = "SELECT * FROM hotel_chain WHERE chain_slug = $1";
  const values = [chainSlug];
  const { rows } = await db.query(query, values);
  await db.end();
  return rows[0];
};

/**
 * Updates a hotel chain.
 * @param chain_name - The name of the hotel chain.
 * @param phone_numbers - An array of phone numbers associated with the hotel chain.
 * @param email_addresses - An array of email addresses associated with the hotel chain.
 * @param central_address - The central address of the hotel chain.
 * @returns A promise that resolves to an empty string if the update is successful, or an error message if an error occurs.
 */
const updateHotelChain = async (hotelChain: HotelChain): Promise<string> => {
  const db = await createDatabaseClient();

  try {
    await db.connect();
    const { chain_name, phone_numbers, email_addresses, central_address } =
      hotelChain;
    const slug = slugify(chain_name, { lower: true });

    const searchQuery =
      "SELECT * FROM hotel_chain WHERE central_address = $1 AND chain_slug != $2";
    const searchValues = [central_address, slug];
    const searchResult = await db.query(searchQuery, searchValues);

    // Throw an error if the chain name or central address already exists
    if (searchResult.rows?.length > 0) {
      if (searchResult.rows[0].chain_slug === slug)
        return "Hotel chain already exists!";
      if (searchResult.rows[0].central_address === central_address)
        return "Central address already exists!";
    }

    const query =
      "UPDATE hotel_chain SET phone_numbers = $2, email_addresses = $3, central_address = $4 WHERE chain_slug = $1";
    const values = [slug, phone_numbers, email_addresses, central_address];
    await db.query(query, values);
  } catch (error) {
    return "Unexpected error occurred while updating hotel chain. Please try again.";
  } finally {
    await db.end();
  }
  return "";
};

/**
 * Deletes a hotel chain.
 * @param chainName - The name of the hotel chain to delete.
 * @returns A promise that resolves to an empty string if the deletion is successful, or an error message if an error occurs.
 */
// TODO: fix error when deleting hotel chain with hotel referenced by booking table
const deleteHotelChain = async (chainName: string): Promise<string> => {
  const db = await createDatabaseClient();

  try {
    await db.connect();
    const slug = slugify(chainName, { lower: true });

    const query = "DELETE FROM hotel_chain WHERE chain_slug = $1";
    const values = [slug];
    await db.query(query, values);
  } catch (error) {
    console.error(error);
    return "Unexpected error occurred while deleting hotel chain. Please try again.";
  } finally {
    await db.end();
  }
  return "";
};

export {
  getAllHotelChains,
  getSingleHotelChain,
  updateHotelChain,
  createHotelChain,
  deleteHotelChain,
};
