"use server";

import { createDatabaseClient } from "./database";

/**
 * Represents an employee in the hotel management system.
 */
export type Employee = {
  full_name: string;
  address: string;
  role: "manager" | "regular";
  hotel_slug: string;
  sin: string;
};

/**
 * Creates a new employee in the database.
 * @param employee - The employee object containing the employee details.
 * @returns A promise that resolves to an empty string if the employee is created successfully, or an error message if an error occurs.
 */
const createEmployee = async (employee: Employee): Promise<string> => {
  const db = await createDatabaseClient();

  try {
    await db.connect();

    const { full_name, address, sin, role, hotel_slug } = employee;

    const searchQuery = "SELECT * FROM employee WHERE sin = $1";
    const searchValues = [sin];
    const { rows } = await db.query(searchQuery, searchValues);
    if (rows.length > 0) {
      return "Employee with this SIN already exists!";
    }

    const query =
      "INSERT INTO employee (full_name, address, sin, role, hotel_slug) VALUES ($1, $2, $3, $4, $5)";
    const values = [full_name, address, sin, role, hotel_slug];
    await db.query(query, values);
    await db.end();
  } catch (error) {
    return "Unexpected error occurred while creating employee! Please try again.";
  } finally {
    await db.end();
  }
  return "";
};

/**
 * Retrieves all employees from the database.
 * @returns A promise that resolves to an array of Employee objects representing all employees in the database.
 */
const getAllEmployees = async (): Promise<Employee[]> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM employee";
  const { rows } = await db.query(query);
  await db.end();
  return rows;
};

/**
 * Retrieves all employees of a specific hotel from the database.
 * @param hotel_slug - The slug of the hotel.
 * @returns A promise that resolves to an array of Employee objects representing all employees of the specified hotel.
 */
const getHotelEmployees = async (hotel_slug: string): Promise<Employee[]> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM employee WHERE hotel_slug = $1";
  const values = [hotel_slug];
  const { rows } = await db.query(query, values);
  await db.end();
  return rows;
};

/**
 * Retrieves an employee from the database based on their SIN (Social Insurance Number).
 * @param sin - The SIN of the employee.
 * @returns A promise that resolves to the Employee object representing the employee with the specified SIN.
 */
const getEmployee = async (sin: string): Promise<Employee> => {
  const db = await createDatabaseClient();
  await db.connect();
  const query = "SELECT * FROM employee WHERE sin = $1";
  const values = [sin];
  const { rows } = await db.query(query, values);
  await db.end();
  return rows[0];
};

/**
 * Updates an existing employee in the database.
 * @param employee - The updated employee object containing the updated employee details.
 * @returns A promise that resolves to an empty string if the employee is updated successfully, or an error message if an error occurs.
 */
const updateEmployee = async (employee: Employee): Promise<string> => {
  const db = await createDatabaseClient();

  try {
    await db.connect();
    const { full_name, address, sin, role, hotel_slug } = employee;
    const query =
      "UPDATE employee SET full_name = $1, address = $2, role = $3, hotel_slug = $4 WHERE sin = $5";
    const values = [full_name, address, role, hotel_slug, sin];
    await db.query(query, values);
    await db.end();
  } catch (error) {
    return "Unexpected error occurred while updating employee! Please try again.";
  } finally {
    await db.end();
  }
  return "";
};

/**
 * Deletes an employee from the database.
 * @param sin - The SIN of the employee to be deleted.
 * @returns A promise that resolves to an empty string if the employee is deleted successfully, or an error message if an error occurs.
 */
const deleteEmployee = async (sin: string): Promise<string> => {
  const db = await createDatabaseClient();

  try {
    await db.connect();
    const query = "DELETE FROM employee WHERE sin = $1";
    const values = [sin];
    await db.query(query, values);
  } catch (error) {
    return "Unexpected error occurred while deleting employee! Please try again.";
  } finally {
    await db.end();
  }
  return "";
};

export {
  createEmployee,
  getAllEmployees,
  getHotelEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
