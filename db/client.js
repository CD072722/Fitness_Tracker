const { Pool } = require("pg");

const connectionString =
  "postgres://doexyhoxcxszep:3dd3c2ae1afe51d52864327eb46742562edf4d1949d45cfc27a030f8e37127b3@ec2-3-208-74-199.compute-1.amazonaws.com:5432/dmc53rufqfdoi";

const client = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = client;
