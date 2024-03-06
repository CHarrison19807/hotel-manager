import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phoneNumberString: string) {
  const containsAlphabetic = /[a-zA-Z]/.test(phoneNumberString);

  if (containsAlphabetic) {
    return null;
  }
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  const final = match
    ? "(" + match[1] + ") " + match[2] + "-" + match[3]
    : null;
  return final;
}

export type hotel_chain = {
  chain_name: string;
  phone_numbers: string[];
  email_addresses: string[];
  central_address: string;
  number_hotels: number;
};

export type hotel = {
  hotel_name: string;
  chain_name: string;
  phone_numbers: string[];
  email_addresses: string[];
  address: string;
  rating: number;
};
