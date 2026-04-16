const { Pool } = require("pg");
require("dotenv").config();

const ssl =
  process.env.PGSSLMODE === "disable"
    ? false
    : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
});

const connection = async () => {
  const client = await pool.connect();
  console.log("Postgres pool connected");

  const query = async (sql, binding) => {
    const result = await client.query(sql, binding);
    return result.rows;
  };

  const release = async () => {
    console.log("Postgres pool released");
    client.release();
  };

  return { query, release };
};

module.exports = { pool, connection };
