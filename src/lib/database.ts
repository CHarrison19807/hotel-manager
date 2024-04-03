import pg from "pg";

const createDatabaseClient = async () => {
  const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    port: 5432,
    database: "dream_stay",
    password: "postgres",
  });

  return db;
};

export { createDatabaseClient };
