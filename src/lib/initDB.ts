import slugify from "slugify";
import { createDatabaseClient } from "./database";

// Run this file with the following command:
// npx ts-node --skip-project src/lib/initDB.ts

const dummyHotelChains = [
  {
    chain_name: "Hilton",
    phone_numbers: ["1234567890", "0987654321"],
    email_addresses: ["hilton@email.com", "email@hilton.com"],
    central_address: "123 Hilton St",
  },
  {
    chain_name: "Marriott",
    phone_numbers: ["1111111111", "2222222222"],
    email_addresses: ["marriott@email.com", "email@marriott.com"],
    central_address: "456 Marriott St",
  },
  {
    chain_name: "Accor",
    phone_numbers: ["3333333333", "4444444444"],
    email_addresses: ["accor@email.com", "email@accor.com"],
    central_address: "789 Accor St",
  },
  {
    chain_name: "InterContinental",
    phone_numbers: ["5555555555", "6666666666"],
    email_addresses: [
      "intercontinental@email.com",
      "email@intercontinental.com",
    ],
    central_address: "987 InterContinental St",
  },
  {
    chain_name: "Hyatt",
    phone_numbers: ["7777777777", "8888888888"],
    email_addresses: ["hyatt@email.com", "email@hyatt.com"],
    central_address: "654 Hyatt St",
  },
];

const dummyHotels = [
  {
    hotel_name: "Hilton Hotel 1",
    phone_numbers: ["1111111111", "2222222222"],
    email_addresses: ["hilton1@email.com", "email@hilton1.com"],
    address: "123 Hilton St",
    rating: 4,
    chain_name: "Hilton",
  },
  {
    hotel_name: "Hilton Hotel 2",
    phone_numbers: ["3333333333", "4444444444"],
    email_addresses: ["hilton2@email.com", "email@hilton2.com"],
    address: "456 Hilton St",
    rating: 3,
    chain_name: "Hilton",
  },
  {
    hotel_name: "Hilton Hotel 3",
    phone_numbers: ["5555555555", "6666666666"],
    email_addresses: ["hilton3@email.com", "email@hilton3.com"],
    address: "789 Hilton St",
    rating: 5,
    chain_name: "Hilton",
  },
  {
    hotel_name: "Marriott Hotel 1",
    phone_numbers: ["7777777777", "8888888888"],
    email_addresses: ["marriott1@email.com", "email@marriott1.com"],
    address: "123 Marriott St",
    rating: 4,
    chain_name: "Marriott",
  },
  {
    hotel_name: "Marriott Hotel 2",
    phone_numbers: ["9999999999", "0000000000"],
    email_addresses: ["marriott2@email.com", "email@marriott2.com"],
    address: "456 Marriott St",
    rating: 3,
    chain_name: "Marriott",
  },
  {
    hotel_name: "Marriott Hotel 3",
    phone_numbers: ["1111111111", "2222222222"],
    email_addresses: ["marriott3@email.com", "email@marriott3.com"],
    address: "789 Marriott St",
    rating: 5,
    chain_name: "Marriott",
  },
  {
    hotel_name: "Accor Hotel 1",
    phone_numbers: ["3333333333", "4444444444"],
    email_addresses: ["accor1@email.com", "email@accor1.com"],
    address: "123 Accor St",
    rating: 4,
    chain_name: "Accor",
  },
  {
    hotel_name: "Accor Hotel 2",
    phone_numbers: ["5555555555", "6666666666"],
    email_addresses: ["accor2@email.com", "email@accor2.com"],
    address: "456 Accor St",
    rating: 3,
    chain_name: "Accor",
  },
  {
    hotel_name: "Accor Hotel 3",
    phone_numbers: ["7777777777", "8888888888"],
    email_addresses: ["accor3@email.com", "email@accor3.com"],
    address: "789 Accor St",
    rating: 5,
    chain_name: "Accor",
  },
  {
    hotel_name: "InterContinental Hotel 1",
    phone_numbers: ["9999999999", "0000000000"],
    email_addresses: [
      "intercontinental1@email.com",
      "email@intercontinental1.com",
    ],
    address: "123 InterContinental St",
    rating: 4,
    chain_name: "InterContinental",
  },
  {
    hotel_name: "InterContinental Hotel 2",
    phone_numbers: ["1111111111", "2222222222"],
    email_addresses: [
      "intercontinental2@email.com",
      "email@intercontinental2.com",
    ],
    address: "456 InterContinental St",
    rating: 3,
    chain_name: "InterContinental",
  },
  {
    hotel_name: "InterContinental Hotel 3",
    phone_numbers: ["3333333333", "4444444444"],
    email_addresses: [
      "intercontinental3@email.com",
      "email@intercontinental3.com",
    ],
    address: "789 InterContinental St",
    rating: 5,
    chain_name: "InterContinental",
  },
  {
    hotel_name: "Hyatt Hotel 1",
    phone_numbers: ["5555555555", "6666666666"],
    email_addresses: ["hyatt1@email.com", "email@hyatt1.com"],
    address: "123 Hyatt St",
    rating: 4,
    chain_name: "Hyatt",
  },
  {
    hotel_name: "Hyatt Hotel 2",
    phone_numbers: ["7777777777", "8888888888"],
    email_addresses: ["hyatt2@email.com", "email@hyatt2.com"],
    address: "456 Hyatt St",
    rating: 3,
    chain_name: "Hyatt",
  },
  {
    hotel_name: "Hyatt Hotel 3",
    phone_numbers: ["9999999999", "0000000000"],
    email_addresses: ["hyatt3@email.com", "email@hyatt3.com"],
    address: "789 Hyatt St",
    rating: 5,
    chain_name: "Hyatt",
  },
];

const dummyHotelRooms = [
  {
    room_number: 101,
    hotel_name: "Hilton Hotel 1",
    price: 100,
    damages: ["Broken lamp", "Stained carpet"],
    amenities: ["TV", "Wi-Fi"],
    occupied: false,
    extended: false,
    capacity: "single",
    view: "ocean",
  },
  {
    room_number: 102,
    hotel_name: "Hilton Hotel 1",
    price: 120,
    damages: ["Cracked mirror", "Leaky faucet"],
    amenities: ["Air conditioning", "Mini fridge"],
    occupied: false,
    extended: false,
    capacity: "double",
    view: "city",
  },
  {
    room_number: 103,
    hotel_name: "Hilton Hotel 1",
    price: 150,
    damages: ["Torn curtains", "Scratched furniture"],
    amenities: ["Room service", "Safe"],
    occupied: false,
    extended: false,
    capacity: "suite",
    view: "garden",
  },
  {
    room_number: 201,
    hotel_name: "Hilton Hotel 2",
    price: 90,
    damages: ["Broken chair", "Clogged sink"],
    amenities: ["Gym access", "Laundry service"],
    occupied: false,
    extended: false,
    capacity: "single",
    view: "city",
  },
  {
    room_number: 202,
    hotel_name: "Hilton Hotel 2",
    price: 110,
    damages: ["Stained sheets", "Faulty TV"],
    amenities: ["Swimming pool", "Restaurant"],
    occupied: false,
    extended: false,
    capacity: "double",
    view: "ocean",
  },
  {
    room_number: 203,
    hotel_name: "Hilton Hotel 2",
    price: 130,
    damages: ["Cracked window", "Noisy air conditioning"],
    amenities: ["Business center", "Concierge"],
    occupied: false,
    extended: false,
    capacity: "suite",
    view: "garden",
  },
  {
    room_number: 301,
    hotel_name: "Hilton Hotel 3",
    price: 80,
    damages: ["Worn-out carpet", "Flickering lights"],
    amenities: ["Free breakfast", "Shuttle service"],
    occupied: false,
    extended: false,
    capacity: "single",
    view: "garden",
  },
  {
    room_number: 302,
    hotel_name: "Hilton Hotel 3",
    price: 100,
    damages: ["Leaky shower", "No hot water"],
    amenities: ["Spa", "Bar"],
    occupied: false,
    extended: false,
    capacity: "double",
    view: "city",
  },
  {
    room_number: 303,
    hotel_name: "Hilton Hotel 3",
    price: 120,
    damages: ["Damaged door lock", "Faulty safe"],
    amenities: ["Conference room", "Gift shop"],
    occupied: false,
    extended: false,
    capacity: "suite",
    view: "ocean",
  },
];

const initHotelChains = async () => {
  const db = await createDatabaseClient();
  db.connect();
  try {
    for (const chain of dummyHotelChains) {
      const query = "INSERT INTO hotel_chain VALUES ($1, $2, $3, $4, $5)";
      const values = [
        slugify(chain.chain_name, { lower: true }),
        chain.chain_name,
        chain.phone_numbers,
        chain.email_addresses,
        chain.central_address,
      ];
      const result = await db.query(query, values);
      console.log(`Inserted ${result.rowCount} row(s) into hotel_chain table.`);
    }
  } catch (error) {
    console.error("Error inserting hotel chains:", error);
  } finally {
    await db.end();
  }
};

const initHotels = async () => {
  const db = await createDatabaseClient();
  db.connect();
  try {
    for (const hotel of dummyHotels) {
      const query = "INSERT INTO hotel VALUES ($1, $2, $3, $4, $5, $6, $7)";
      const values = [
        slugify(hotel.hotel_name, { lower: true }),
        hotel.hotel_name,
        slugify(hotel.chain_name, { lower: true }),
        hotel.phone_numbers,
        hotel.email_addresses,
        hotel.address,
        hotel.rating,
      ];
      const result = await db.query(query, values);
      console.log(`Inserted ${result.rowCount} row(s) into hotel table.`);
    }
  } catch (error) {
    console.error("Error inserting hotels:", error);
  } finally {
    await db.end();
  }
};

const initHotelRooms = async () => {
  const db = await createDatabaseClient();
  db.connect();
  try {
    for (const room of dummyHotelRooms) {
      const query =
        "INSERT INTO hotel_room VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
      const values = [
        room.room_number,
        slugify(room.hotel_name, { lower: true }),
        room.price,
        room.damages,
        room.amenities,
        room.occupied,
        room.extended,
        room.capacity,
        room.view,
      ];
      const result = await db.query(query, values);
      console.log(`Inserted ${result.rowCount} row(s) into hotel_room table.`);
    }
  } catch (error) {
    console.error("Error inserting hotel rooms:", error);
  } finally {
    await db.end();
  }
};
console.log("Initializing database...");

initHotelChains().then(() => {
  console.log("Hotel chains initialized.");
  initHotels()
    .then(() => {
      console.log("Hotels initialized.");
    })
    .then(() => {
      initHotelRooms().then(() => {
        console.log("Hotel rooms initialized.");
        console.log("Database initialized.");
      });
    });
});
