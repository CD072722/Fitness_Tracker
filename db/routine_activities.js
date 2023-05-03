const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {

    const {
      rows: [routine_activity],
    } = await client.query(
      `
  INSERT INTO routine_activities("routineId", "activityId", count, duration) 
  VALUES($1, $2, $3, $4) 
  RETURNING *;
`,
      [routineId, activityId, count, duration]
    );

    return routine_activity;
  } catch (error) {
    console.log(error);
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM routine_activities
      WHERE id = $1;
    `,
      [id]
    );

    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM routine_activities
      WHERE "routineId" = $1;
    `,
      [id]
    );

    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  try {
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 2}`)
      .join(", ");

    const values = [id, ...Object.values(fields)];

    const { rows } = await client.query(
      `


      UPDATE routine_activities
      SET ${setString}
      WHERE id = $1
      RETURNING *;

    `,
      values
    );

    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows } = await client.query(
      `
      DELETE FROM routine_activities
      WHERE id = $1
      RETURNING *;
    `,
      [id]
    );

    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const { rows } = await client.query(
      `
      SELECT ra.*, r."creatorId" FROM routine_activities ra
      JOIN routines r ON ra."routineId" = r.id
      WHERE ra.id = $1 AND r."creatorId" = $2;
    `,
      [routineActivityId, userId]
    );

    return rows.length > 0;
  } catch (error) {
    console.log(error);
  }
}



module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
