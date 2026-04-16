
// original!!!
// require("dotenv").config();
// const MySql = require("./MySql");

// exports.execQuery = async function (query) {
//     let returnValue = []
// const connection = await MySql.connection();
//     try {
//     await connection.query("START TRANSACTION");
//     returnValue = await connection.query(query);
//   } catch (err) {
//     await connection.query("ROLLBACK");
//     console.log('ROLLBACK at querySignUp', err);
//     throw err;
//   } finally {
//     await connection.release();
//   }
//   return returnValue
// }


require("dotenv").config();
const MySql = require("./MySql");
const Postgres = require("./Postgres");

const usePostgres =
  process.env.DB_CLIENT === "postgres" || Boolean(process.env.DATABASE_URL);

function convertPlaceholders(query) {
  let index = 0;
  return query.replace(/\?/g, () => `$${++index}`);
}

exports.execQuery = async function (query, params) {
  let returnValue = [];
  const db = usePostgres ? Postgres : MySql;
  const connection = await db.connection();
  const finalQuery = usePostgres && params ? convertPlaceholders(query) : query;
  try {
    await connection.query(usePostgres ? "BEGIN" : "START TRANSACTION");
    returnValue = await connection.query(finalQuery, params);
    await connection.query("COMMIT");
  } catch (err) {
    await connection.query("ROLLBACK");
    console.log('ROLLBACK at querySignUp', err);
    throw err;
  } finally {
    await connection.release();
  }
  return returnValue;
};

exports.isPostgres = usePostgres;
