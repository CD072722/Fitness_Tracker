const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  try {
    const {
      rows: [activities],
    } = await client.query(
      `
        INSERT INTO activities(name, description) 
        VALUES($1, $2)
        RETURNING *;
      `,
      [name, description]
    );

    return activities;
  } catch (error) {
    console.log(error);
  }
}
// return the new activity

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM activities;
    `);

    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function getActivityById(id) {
  try {
    const {
      rows: [activities],
    } = await client.query(
      `
      SELECT *
      FROM activities
      WHERE id=$1;
    `,
      [id]
    );

    if (!activities) {
      throw {
        name: "Activity Not Found Error",
        message: "Could not find an activity with that Id",
      };
    }
    return activities;
  } catch (error) {
    console.log(error);
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT *
      FROM activities
      WHERE name=$1;
    `,
      [name]
    );

    return activity;
  } catch (error) {
    console.log(error);
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [activities],
    } = await client.query(
      `
      UPDATE activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return activities;
  } catch (error) {
    console.log(error);
  }
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
