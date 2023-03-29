require("dotenv").config();
const { Client } = require("pg");
const dbConnData = {
    host: process.env.PGHOST || "192.168.0.12",
    port: process.env.PGPORT || 6270,
    database: "postgres",
    user: "postgres",
    password: "password"
};

const client = new Client(dbConnData);

module.exports = client;