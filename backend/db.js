const { Pool } = require('pg');
const { database, password } = require('pg/lib/defaults');
require('dotenv').config();


const pool = new Pool ({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false,
    },
});

/*
const pool = new Pool ({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: "5432",
  database: "postgres"
});
*/

pool.connect((err) => {
    if (err) {
      console.error('Error connecting to the database', err);
    } else {
      console.log('Connected to the database');
    }
});

module.exports = pool;