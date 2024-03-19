"use server";

/**
 * Represents a user in the system.
 */
export type User = Employee | Customer | null;

import { cookies } from "next/headers";
import { Employee } from "./employee";
import { Customer } from "./customer";

/**
 * Sets the user in the cookies.
 * @param user - The user object to be stored in the cookies.
 */
const setUser = async (user: User) => {
  const userJson = JSON.stringify(user);
  console.log(userJson);
  cookies().set("user", userJson);
};

/**
 * Logs out the user by deleting the user cookie.
 * @returns A Promise that resolves to true if the user was successfully logged out, or false otherwise.
 */
const logoutUser = async (): Promise<boolean> => {
  try {
    cookies().delete("user");
  } catch (error) {
    return false;
  }
  return true;
};

/**
 * Retrieves the user from the server-side cookies.
 * @returns A Promise that resolves to the user object if it exists in the cookies, or null otherwise.
 */
const getServerSideUser = async (): Promise<User> => {
  const userCookies = cookies().get("user")?.value;
  if (userCookies) {
    const user = JSON.parse(userCookies);
    return user;
  }
  return null;
};

/**
 * Checks if the user is the same user or an employee.
 * @param sin - The SIN of the user to check against.
 * @returns A Promise that resolves to true if the user is the same user or an employee, or false otherwise.
 */
const isSelfOrEmployee = async (sin: string): Promise<boolean> => {
  const user = await getServerSideUser();
  if (user && user.sin === sin) return true;
  if (user && (user as Employee).role) return true;

  return false;
};

/**
 * Checks if the user is the same user or a manager at the specified hotel.
 * @param sin - The SIN of the user to check against.
 * @param hotel_slug - The slug of the hotel to check against.
 * @returns A Promise that resolves to true if the user is the same user or a manager at the specified hotel, or false otherwise.
 */
const isSelfOrManagerAtHotel = async (
  sin: string,
  hotel_slug: string
): Promise<boolean> => {
  const user = await getServerSideUser();
  if (user && user.sin === sin) return true;
  if (
    user &&
    (user as Employee).role === "manager" &&
    (user as Employee).hotel_slug === hotel_slug
  )
    return true;

  return false;
};

export {
  setUser,
  logoutUser,
  getServerSideUser,
  isSelfOrEmployee,
  isSelfOrManagerAtHotel,
};
