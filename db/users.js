const client = require("./client");
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
   
    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password)
      VALUES($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING username, id;
    `, [username, hashedPassword]);

    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username = $1;
    `, [userName]);
   
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return null;
    }

    const hashedPassword = user.password;
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      return null;
    }

    delete user.password;
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUserById(userId) {
  try {
    const { rows } = await client.query(`
      SELECT id, username
      FROM users
      WHERE id = $1;
    `, [userId]);

    return rows[0];
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
