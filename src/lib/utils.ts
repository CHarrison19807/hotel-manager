import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const HOTEL_ROOM_DAMAGE_OPTIONS = [
  "Broken window",
  "Stained carpet",
  "Damaged furniture",
  "Leaking faucet",
  "Cracked mirror",
  "Clogged toilet",
  "Torn curtains",
  "Scratched walls",
  "Faulty electrical wiring",
  "Moldy bathroom",
  "Broken showerhead",
  "Water damage on ceiling",
  "Missing light fixtures",
  "Broken air conditioning",
  "Damaged TV",
  "Broken door lock",
  "Noisy plumbing",
  "Broken bed frame",
  "Smashed glass",
  "Damaged wallpaper",
];
export const HOTEL_ROOM_AMENITY_OPTIONS = [
  "Free Wi-Fi",
  "Complimentary Breakfast",
  "Free Parking",
  "Airport Shuttle",
  "Concierge Service",
  "24-Hour Front Desk",
  "Business Center",
  "Meeting Facilities",
  "Free Newspaper",
  "Room Service",
  "Laundry Facilities",
  "Fitness Center",
  "Spa Services",
  "Outdoor Terrace",
  "Garden",
  "Pet-Friendly",
  "Non-Smoking Rooms",
  "Accessible Rooms",
  "Family Rooms",
  "Childcare Services",
  "Valet Parking",
];
/**
 * Combines multiple class names into a single string.
 * @param inputs - The class names to be combined.
 * @returns The combined class names as a string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a phone number string into a specific format.
 * @param phoneNumberString - The phone number string to be formatted.
 *
 * @returns The formatted phone number string, or null if the input contains alphabetic characters.
 */
export function formatPhoneNumber(phoneNumberString: string): string | null {
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

/**
 * Formats a price value into a specific currency format.
 * @param price - The price value to be formatted.
 * @returns The formatted price as a string.
 */
export const formatPrice = (price: number | string): string => {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

/**
 * Converts a slug string into a human-readable format.
 * @param slug - The slug string to be converted.
 * @returns The converted string with words separated by spaces and capitalized.
 */
export const unslugify = (slug: string): string => {
  let words = slug.split("-");
  words = words.map((word) => {
    if (word.length < 3) return word;

    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return words.join(" ");
};

/**
 * Formats a Social Insurance Number (SIN) string into a specific format.
 * @param sin - The SIN string to be formatted.
 * @returns The formatted SIN string.
 */
export const formatSIN = (sin: string): string => {
  return sin.replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3");
};

/**
 * Converts an ID string into a human-readable format.
 * @param id - The ID string to be converted.
 * @returns The converted string with words separated by spaces and capitalized.
 */
export const unIDify = (id: string): string => {
  let words = id.split("_");
  words = words.map((word) => {
    if (word.length < 4) return word;

    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  if (words.length === 1 && words[0].length < 4) {
    return words[0].toUpperCase();
  }
  return words.join(" ");
};

/**
 * Generates a random ID string.
 * @returns The generated ID string.
 */
export const generateID = (): string => {
  const id = (Math.floor(Math.random() * 900000000) + 100000000).toString();
  return id;
};

/**
 *
 * @param initial The initial price of the hotel room.
 * @param amenities Each index of the array represents an amenity.
 * @param damages Each index of the array represents a damage.
 * @returns The final price after applying multipliers based on the number of amenities and damages.
 */
export const calculateFinalPrice = (
  initial: number,
  amenities: string[] | number[],
  damages: string[] | number[]
): number => {
  let multiplier = 1.0;

  amenities.forEach((amenity, index) => {
    if (index > 1) {
      multiplier += 0.05;
    }
  });

  if (damages.length > 0) {
    multiplier -= 0.1;
  }

  return initial * multiplier;
};
/**
 *
 * @param startDate First date
 * @param endDate Last date
 * @returns An array of dates between the start and end dates
 */

export const getDatesBetween = (startDate: Date, endDate: Date) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate).toLocaleDateString());
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
