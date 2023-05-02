const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
  INSERT INTO routines("creatorId", "isPublic", name, goal) 
  VALUES($1, $2, $3, $4) 
  RETURNING *;
`, [creatorId, isPublic, name, goal]);
  
    return routine ;
  } catch (error) {
    console.log(error);
  }
}



async function getRoutineById(id) {
  // try {
  //   const { rows } = await client.query(`
  //     SELECT * FROM routines
  //     WHERE id = $1;
  //   `, [id]);

  //   return rows[0];
  // } catch (error) {
  //   console.log(error);
  // }
}

async function getRoutinesWithoutActivities() {
  // try {
  //   const { rows } = await client.query(`
  //     SELECT * FROM routines
  //     WHERE id NOT IN (
  //       SELECT "routineId" FROM routine_activities
  //     );
  //   `);

  //   return rows;
  // } catch (error) {
  //   console.log(error);
  // }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
      SELECT routines.*, array_agg(routine_activities.*) AS activities
      FROM routines
      RIGHT JOIN routine_activities ON routines.id = routine_activities."routineId"
      GROUP BY routines.id;
    `);
    console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM routines
      WHERE "isPublic" = true;
    `);

    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function getAllRoutinesByUser({ username }) {
  // try {
  //   const { rows } = await client.query(`
  //     SELECT * FROM routines
  //     WHERE "creatorId" = (
  //       SELECT id FROM users WHERE username = $1
  //     );
  //   `, [username]);

  //   return rows;
  // } catch (error) {
  //   console.log(error);
  // }
}

async function getPublicRoutinesByUser({ username }) {
  // try {
  //   const { rows } = await client.query(`
  //     SELECT * FROM routines
  //     WHERE "creatorId" = (
  //       SELECT id FROM users WHERE username = $1
  //     )
  //     AND "isPublic" = true;
  //   `, [username]);

  //   return rows;
  // } catch (error) {
  //   console.log(error);
  // }
}

async function getPublicRoutinesByActivity({ id }) {
  // try {
  //   const { rows } = await client.query(`
  //     SELECT routines.* FROM routines
  //     JOIN routine_activities
  //     ON routines.id = routine_activities."routineId"
  //     WHERE routine_activities."activityId = $1
  //     AND routines."isPublic" = true;
  //   `, [id]);

  //   return rows;
  // } catch (error) {
  //   console.log(error);
  // }
}

async function updateRoutine({ id, ...fields }) {
  // try {
  //   const setString = Object.keys(fields).map(
  //     (key, index) => `"${key}"=$${index + 2}`
  //   ).join(", ");

  //   const values = [id, ...Object.values(fields)];

  //   const { rows } = await client.query(`
  //     UPDATE routines
  //     SET ${setString}
  //     WHERE id = $1
  //     RETURNING *;
  //   `, values);

  //   return rows[0];
  // } catch (error) {
  //   console.log(error);
  // }
}

async function destroyRoutine(id) {
  // try {
  //   const { rows } = await client.query(`
  //     DELETE FROM routines
  //     WHERE id = $1
  //     RETURNING *;
  //   `, [id]);

  //   return rows[0];
  // } catch (error) {
  //   console.log(error);
  // }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
