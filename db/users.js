const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const {rows: [user]} = await client.query(`
      INSERT INTO users(username, password)
      VALUES($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING username;
    `, [username, password])
    
    // const SALT_COUNT = 10;
    // const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

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
      WHERE username=$1;
    `, [userName]);

    return user;
  } catch (error) {
    console.log(error)
  }
}

async function getUser({ username, password }) {
  
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    // const isValid = await bcrypt.compare(password, hashedPassword);

    if(hashedPassword !== password){
      return null;
    }
  
    delete user.password;
    return user;
  } catch (error) {
    console.log(error)
  }
  

}

async function getUserById(userId) {
  try {
    const {rows} = await client.query(`
      SELECT id, username
      FROM users
      WHERE id=$1;
    `, [userId]);

    return rows;
  } catch (error) {
    console.error(error);
  }
}



module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
