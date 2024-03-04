import pg from "pg";
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "hotelhub",
  password: "postgres",
});
db.connect();

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
// Run this file with the following command:
// npx ts-node --skip-project src/initDB.ts
const initHotelChains = async () => {
  for (const chain of dummyHotelChains) {
    const query = "INSERT INTO hotel_chain VALUES ($1, $2, $3, $4)";
    const values = [
      chain.chain_name,
      chain.phone_numbers,
      chain.email_addresses,
      chain.central_address,
    ];
    const result = await db.query(query, values);
    console.log(`Inserted ${result.rowCount} row(s) into hotel_chain table.`);
  }
};

initHotelChains();

db.end();
