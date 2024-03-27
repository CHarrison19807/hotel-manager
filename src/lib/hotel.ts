"use server";

import slugify from "slugify";
import { createDatabaseClient } from "./database";
import { createEmployee } from "./employee";
import { generateID } from "./utils";

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
 * Creates a new hotel in the database.
 * @param hotel - The hotel object to be created.
 * @returns A promise that resolves to an empty string if the hotel is created successfully, or an error message.
 */
const createHotel = async (hotel: Hotel): Promise<string> => {
  const db = await createDatabaseClient();

  try {
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
      "SELECT * FROM hotel WHERE (hotel_slug = $1) OR (address = $2)";
    const searchValues = [hotelSlug, address];
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

    for (let i = 0; i < 2; i++) {
      await createEmployee({
        full_name: `Hotel ${i === 0 ? "Manager" : "Employee"} Placeholder`,
        address: `123 ${i === 0 ? hotel_name + " M" : hotel_name + " E"} St.`,
        hotel_slug: hotelSlug,
        role: i === 0 ? "manager" : "regular",
        sin: generateID(),
      });
    }
    return "";
  } catch (error) {
    return "Unexpected error occurred while creating hotel! Please try again.";
  } finally {
    await db.end();
  }
};

/**
 * Retrieves all hotels from the database.
 * @returns A promise that resolves to an array of Hotel objects.
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
 * Retrieves all hotels belonging to a specific chain from the database.
 * @param chainSlug - The slug of the chain.
 * @returns A promise that resolves to an array of Hotel objects.
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
 * Retrieves a single hotel from the database.
 * @param hotelName - The name of the hotel.
 * @returns A promise that resolves to a Hotel object.
 */
const getSingleHotel = async (hotelName: string): Promise<Hotel> => {
  const db = await createDatabaseClient();
  await db.connect();
  const hotelSlug = slugify(hotelName, { lower: true });
  const query = "SELECT * FROM hotel WHERE hotel_slug = $1";
  const values = [hotelSlug];
  const result = await db.query(query, values);

  await db.end();
  return result.rows[0];
};

/**
 * Updates a hotel in the database.
 * @param hotel - The updated hotel object.
 * @param previousHotelName - The previous name of the hotel.
 * @returns A promise that resolves to an empty string if the hotel is updated successfully, or an error message.
 */
const updateHotel = async (
  hotel: Hotel,
  previousHotelName: string
): Promise<string> => {
  const db = await createDatabaseClient();

  try {
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
    const previousHotelSlug = slugify(previousHotelName, { lower: true });
    if (previousHotelSlug === hotel_slug) {
      const searchQuery =
        "SELECT * FROM hotel WHERE address = $1 AND hotel_slug != $2";
      const searchValues = [address, hotel_slug];
      const searchResult = await db.query(searchQuery, searchValues);
      if (searchResult.rows?.length > 0) {
        return "Hotel with this address already exists!";
      }

      const query =
        "UPDATE hotel SET phone_numbers = $2, email_addresses = $3, address = $4, rating = $5 WHERE hotel_slug = $6 AND chain_slug = $1";
      const values = [
        chain_slug,
        phone_numbers,
        email_addresses,
        address,
        rating,
        hotel_slug,
      ];
      await db.query(query, values);
    } else {
      const searchQueries = [
        "SELECT * FROM hotel WHERE hotel_slug = $1",
        "SELECT * FROM hotel WHERE address = $1 AND hotel_slug != $2",
      ];
      const searchValueOne = [hotel_slug];
      const searchValueTwo = [address, previousHotelSlug];
      const searchResults = await Promise.all([
        db.query(searchQueries[0], searchValueOne),
        db.query(searchQueries[1], searchValueTwo),
      ]);
      if (searchResults[0].rows?.length > 0) {
        return "Hotel with this name already exists!";
      }
      if (searchResults[1].rows?.length > 0) {
        return "Hotel with this address already exists!";
      }
      const query =
        "UPDATE hotel SET hotel_slug = $1, hotel_name = $2, phone_numbers = $3, email_addresses = $4, address = $5, rating = $6 WHERE hotel_slug = $7 AND chain_slug = $8";
      const values = [
        hotel_slug,
        hotel_name,
        phone_numbers,
        email_addresses,
        address,
        rating,
        previousHotelSlug,
        chain_slug,
      ];
      await db.query(query, values);
    }
    return "";
  } catch (error) {
    return "Unexpected error occurred while updating hotel! Please try again.";
  } finally {
    await db.end();
  }
};

/**
 * Deletes a hotel from the database.
 * @param hotelName - The name of the hotel to be deleted.
 * @param chainSlug - The slug of the chain.
 * @returns A promise that resolves to an empty string if the hotel is deleted successfully, or an error message.
 */
const deleteHotel = async (hotelName: string): Promise<string> => {
  const db = await createDatabaseClient();

  try {
    await db.connect();
    const hotelSlug = slugify(hotelName, { lower: true });
    const query = "DELETE FROM hotel WHERE hotel_slug = $1";
    const values = [hotelSlug];
    await db.query(query, values);
  } catch (error) {
    return "Unexpected error occurred while deleting hotel! Please try again.";
  } finally {
    await db.end();
  }
  return "";
};

export {
  createHotel,
  getAllHotels,
  getChainHotels,
  getSingleHotel,
  updateHotel,
  deleteHotel,
};
