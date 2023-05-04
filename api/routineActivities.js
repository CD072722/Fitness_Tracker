const express = require("express");
const router = express.Router();
const {
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
} = require("../db");
const jwt = require("jsonwebtoken");

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", async (req, res, next) => {
  try {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const userName = decodedToken.username;

    const canEdit = await canEditRoutineActivity(routineActivityId, userId);

    // Update the routine activity in the database
    if (!canEdit) {
      res.status(401);
      next({
        name: "UnauthorizedError",
        message: `User ${userName} is not allowed to update In the evening`,
        // Set the status code to 401 (Unauthorized)
      });
    }
    const updatedRoutineActivity = await updateRoutineActivity({
      id: routineActivityId,
      count,
      duration,
    });

    res.send(updatedRoutineActivity);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", async (req, res, next) => {
  try {
    const { routineActivityId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const userName = decodedToken.username;

    const canEdit = await canEditRoutineActivity(routineActivityId, userId);

    // Update the routine activity in the database
    if (!canEdit) {
      res.status(403);
      next({
        name: "UnauthorizedError",
        message: `User ${userName} is not allowed to delete In the afternoon`,
      });
    }

    // Delete the routine activity from the database
    const destoryedRoutineActivity = await destroyRoutineActivity(
      routineActivityId
    );

    res.send(destoryedRoutineActivity);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
