const express = require('express');
const { getAllRoutines, attachActivitiesToRoutines, createRoutine, canEditRoutine, destroyRoutine } = require('../db');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// GET /api/routines
router.get('/', async (req, res, next) => {
    try {
        const allRoutines = await getAllRoutines();
        const activitiesAndRoutines = await attachActivitiesToRoutines(allRoutines);
        res.send(activitiesAndRoutines);
    } catch (error) {
        console.log(error)
    }
})

// POST /api/routines
router.post('/', async (req, res, next) => {
    try {
        const { routineId } = req.params;
        const token = req.headers.authorization?.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        const userName = decodedToken.username;

    if (userId) {
        const { isPublic, name, goal } = req.body;

        const newRoutine = await createRoutine({ userId, isPublic, name, goal });
        res.send(newRoutine);
      }
    } catch (error) {
        console.log(error)
    }
    
})

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId
router.delete("/:routineId", async (req, res, next) => {
    try {
      const { routineId } = req.params;
      const token = req.headers.authorization?.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.id;
      const userName = decodedToken.username;
  
      const canEdit = await canEditRoutine(routineId, userId);
  
      // Update the routine activity in the database
      if (!canEdit) {
        res.status(403);
        next({
          name: "UnauthorizedError",
          message: `User ${userName} is not allowed to delete On even days`,
        });
      }
  
      // Delete the routine activity from the database
      const destoryedRoutineActivity = await destroyRoutine(
        routineId
      );
  
      res.send(destoryedRoutineActivity);
    } catch (error) {
      next(error);
    }
  });

// POST /api/routines/:routineId/activities

module.exports = router;
