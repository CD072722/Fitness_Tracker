const { Pool } = require("pg");

const connectionString =
  "postgres://hzrbaekjzxbqep:6553ab14cad8491bf1770e9d53d97399a60a545d0c5198e9a19b2fcd58470543@ec2-34-236-56-112.compute-1.amazonaws.com:5432/dabsvllan4usbt";

const client = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = client;
