const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const {rows: [user]} = await client.query(`
      INSERT INTO users(username, password)
      VALUES($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING username
    `, [username, password])
    
    //causing problems right now
    // const SALT_COUNT = 10;
    // const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUser({ username, password }) {

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
