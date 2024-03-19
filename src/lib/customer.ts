"use server";

import { createDatabaseClient } from "./database";

export type Customer = {
  full_name: string;
  address: string;
  sin: string;
  date_registered?: string;
};

const createCustomer = async ({
  full_name,
  address,
  sin,
}: Customer): Promise<string> => {
  const db = await createDatabaseClient();

  try {
    await db.connect();

    const searchQueries = [
      "SELECT * FROM employee WHERE sin = $1;",
      " SELECT * FROM customer WHERE sin = $1;",
    ];

    const searchValues = [sin];
    let result = false;

    await Promise.all(
      searchQueries.map(async (searchQuery) => {
        const searchResults = await db.query(searchQuery, searchValues);
        if (searchResults.rows.length > 0) {
          result = true;
        }
      })
    );

    if (result) {
      return "User with the same SIN already exists.";
    }

    const query =
      "INSERT INTO customer (full_name, address, sin) VALUES ($1, $2, $3);";
    const values = [full_name, address, sin];
    await db.query(query, values);
    await db.end();

    return "";
  } catch (error) {
    console.error(error);
    return "Unexpected error while creating customer! Please try again.";
  } finally {
    await db.end();
  }
};

const getAllCustomers = async (): Promise<Customer[]> => {
  const db = await createDatabaseClient();
  await db.connect();

  const query = "SELECT * FROM customer;";
  const results = await db.query(query);
  await db.end();
  return results.rows;
};

const getCustomer = async (sin: string): Promise<Customer> => {
  const db = await createDatabaseClient();
  await db.connect();

  const query = "SELECT * FROM customer WHERE sin = $1;";
  const values = [sin];
  const results = await db.query(query, values);
  await db.end();
  return results.rows[0];
};

const updateCustomer = async ({
  full_name,
  address,
  sin,
}: Customer): Promise<string> => {
  const db = await createDatabaseClient();

  try {
    await db.connect();

    const query =
      "UPDATE customer SET full_name = $1, address = $2 WHERE sin = $3;";
    const values = [full_name, address, sin];
    await db.query(query, values);
    await db.end();
  } catch (error) {
    console.error(error);
    return "Unexpected error while updating customer! Please try again.";
  } finally {
    await db.end();
  }
  return "";
};

const deleteCustomer = async (sin: string): Promise<string> => {
  const db = await createDatabaseClient();

  try {
    await db.connect();

    const query = "DELETE FROM customer WHERE sin = $1;";
    const values = [sin];
    await db.query(query, values);
    await db.end();
  } catch (error) {
    console.error(error);
    return "Unexpected error while deleting customer! Please try again.";
  } finally {
    await db.end();
  }
  return "";
};

export {
  createCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
