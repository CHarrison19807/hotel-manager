"use server";

// TODO: Write logic to ensure the last manager isnt removed from the hotel
import { createDatabaseClient } from "./database";
import { Employee } from "./utils";

const createEmployee = async ({
  full_name,
  address,
  sin,
  role,
  hotel_slug,
}: Employee): Promise<boolean> => {
  try {
    const db = await createDatabaseClient();
    await db.connect();
    const query =
      "INSERT INTO employee (full_name, address, sin, role, hotel_slug) VALUES ($1, $2, $3, $4, $5)";
    const values = [full_name, address, sin, role, hotel_slug];
    await db.query(query, values);
    await db.end();
  } catch (error) {
    console.error(error);

    return false;
  }
  return true;
};

const getAllEmployees = async (): Promise<Employee[]> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM employee";
  const { rows } = await db.query(query);
  await db.end();
  return rows;
};

const getHotelEmployees = async (hotel_slug: string): Promise<Employee[]> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM employee WHERE hotel_slug = $1";
  const values = [hotel_slug];
  const { rows } = await db.query(query, values);
  await db.end();
  return rows;
};

const getEmployee = async (sin: string): Promise<Employee> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM employee WHERE sin = $1";
  const values = [sin];
  const { rows } = await db.query(query, values);
  await db.end();
  return rows[0];
};

const updateEmployee = async ({
  full_name,
  address,
  sin,
  role,
  hotel_slug,
}: Employee): Promise<boolean> => {
  try {
    const db = await createDatabaseClient();
    await db.connect();
    const query =
      "UPDATE employee SET full_name = $1, address = $2, role = $3, hotel_slug = $4 WHERE sin = $5";
    const values = [full_name, address, role, hotel_slug, sin];
    await db.query(query, values);
    await db.end();
  } catch (error) {
    console.error(error);

    return false;
  }
  return true;
};

const deleteEmployee = async (sin: string): Promise<boolean> => {
  try {
    const db = await createDatabaseClient();
    await db.connect();
    const query = "DELETE FROM employee WHERE sin = $1";
    const values = [sin];
    await db.query(query, values);
    await db.end();
  } catch (error) {
    console.error(error);

    return false;
  }
  return true;
};

export {
  createEmployee,
  getAllEmployees,
  getHotelEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
