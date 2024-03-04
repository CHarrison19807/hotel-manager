import pg from "pg";

const createDatabaseClient = async () => {
  const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    port: 5432,
    database: "hotelhub",
    password: "postgres",
  });

  await db.connect();
  return db;
};

export { createDatabaseClient };
