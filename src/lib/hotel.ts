"use server";

import slugify from "slugify";
import { createDatabaseClient } from "./database";

/**
 * Represents a hotel.
 */
export type Hotel = {
  hotel_name: string;
  hotel_slug?: string;
  chain_slug: string;
  phone_numbers: string[];
  email_addresses: string[];
  address: string;
  rating: number;
  number_rooms?: number;
};

/**
 * Creates a new hotel.
 * @param hotel - The hotel object to create.
 * @returns A promise that resolves to an empty string if the hotel is created successfully, or an error message if an error occurs.
 */
const createHotel = async (hotel: Hotel): Promise<string> => {
  try {
    const db = await createDatabaseClient();
    await db.connect();
    const {
      hotel_name,
      chain_slug,
      phone_numbers,
      email_addresses,
      address,
      rating,
    } = hotel;
    const hotelSlug = slugify(hotel_name, { lower: true });

    const searchQuery =
      "SELECT * FROM hotel WHERE (hotel_slug = $1 AND chain_slug = $2) OR (address = $3)";
    const searchValues = [hotelSlug, chain_slug, address];
    const searchResult = await db.query(searchQuery, searchValues);

    if (searchResult.rows?.length > 0) {
      if (searchResult.rows[0].hotel_slug === hotelSlug) {
        return "Hotel with this name already exists!";
      }
      return "Hotel with this address already exists!";
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
    await db.query(query, values);
    await db.end();
    return "";
  } catch (error) {
    return "Unexpected error occurred while creating hotel! Please try again.";
  }
};

/**
 * Retrieves all hotels.
 * @returns A promise that resolves to an array of hotels representing all hotels.
 */
const getAllHotels = async (): Promise<Hotel[]> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM hotel";
  const result = await db.query(query);
  await db.end();
  return result.rows;
};

/**
 * Retrieves all hotels belonging to a specific chain.
 * @param chainSlug - The slug of the chain.
 * @returns A promise that resolves to an array of hotels representing all hotels part of a chain.
 */
const getChainHotels = async (chainSlug: string): Promise<Hotel[]> => {
  const db = await createDatabaseClient();
  await db.connect();

  const query = "SELECT * FROM hotel WHERE chain_slug = $1";
  const values = [chainSlug];
  const result = await db.query(query, values);

  await db.end();
  return result.rows;
};

/**
 * Retrieves a single hotel.
 * @param hotelName - The name of the hotel.
 * @param chainSlug - The slug of the chain.
 * @returns A promise that resolves to the hotel object representing the hotel with the specified hotel name and chain slug.
 */
const getSingleHotel = async (
  hotelName: string,
  chainSlug: string
): Promise<Hotel> => {
  const db = await createDatabaseClient();
  await db.connect();
  const hotelSlug = slugify(hotelName, { lower: true });
  const query = "SELECT * FROM hotel WHERE hotel_slug = $1 AND chain_slug = $2";
  const values = [hotelSlug, chainSlug];
  const result = await db.query(query, values);

  await db.end();
  return result.rows[0];
};

/**
 * Updates a hotel.
 * @param hotel - The updated hotel object.
 * @returns A promise that resolves to an empty string if the hotel is updated successfully, or an error message if an error occurs.
 */
const updateHotel = async (hotel: Hotel): Promise<string> => {
  try {
    const db = await createDatabaseClient();
    await db.connect();
    const {
      hotel_name,
      hotel_slug,
      chain_slug,
      phone_numbers,
      email_addresses,
      address,
      rating,
    } = hotel;

    if (slugify(hotel_name, { lower: true }) !== hotel_slug) {
      return "Hotel name can not be changed!";
    }

    const searchQuery =
      "SELECT * FROM hotel WHERE address = $1 AND hotel_slug != $2";
    const searchValues = [address, hotel_slug];
    const searchResult = await db.query(searchQuery, searchValues);

    if (searchResult.rows?.length > 0) {
      return "Hotel with this address already exists!";
    }
    const query =
      "UPDATE hotel SET phone_numbers = $3, email_addresses = $4, address = $5, rating = $6 WHERE hotel_slug = $1 AND chain_slug = $2";
    const values = [
      hotel_slug,
      chain_slug,
      phone_numbers,
      email_addresses,
      address,
      rating,
    ];
    await db.query(query, values);
    await db.end();
    return "";
  } catch (error) {
    return "Unexpected error occurred while updating hotel! Please try again.";
  }
};

/**
 * Deletes a hotel.
 * @param hotelName - The name of the hotel.
 * @param chainSlug - The slug of the chain.
 */
const deleteHotel = async (hotelName: string, chainSlug: string) => {
  const db = await createDatabaseClient();
  await db.connect();
  const hotelSlug = slugify(hotelName, { lower: true });
  const query = "DELETE FROM hotel WHERE hotel_slug = $1 AND chain_slug = $2";
  const values = [hotelSlug, chainSlug];
  await db.query(query, values);
  await db.end();
};

export {
  createHotel,
  getAllHotels,
  getChainHotels,
  getSingleHotel,
  updateHotel,
  deleteHotel,
};
