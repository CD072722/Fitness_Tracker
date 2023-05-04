const express = require('express');
const { getAllRoutines, attachActivitiesToRoutines, createRoutine, canEditRoutine, destroyRoutine, getRoutineById, updateRoutine } = require('../db');
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

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(403);
            next({
                name: "UnauthorizedError",
                message: `You must be logged in to perform this action`,
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const { id: userId, username: userName } = decodedToken;
        const { isPublic, name, goal } = req.body;

        const newRoutine = await createRoutine({ creatorId: userId, isPublic, name, goal });
        res.send(newRoutine);
    } catch (error) {
        next(error);
    }
});


// PATCH /api/routines/:routineId
router.patch('/:routineId', async (req, res, next) => {
    try {
      const { routineId } = req.params;
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(403);
        next({
          name: "UnauthorizedError",
          message: "You must be logged in to perform this action",
        });
      }
  
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedToken) {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }
  
      const userId = decodedToken.id;
      const { isPublic, name, goal } = req.body;
      const canEdit = await canEditRoutine(routineId, userId);
      const username = decodedToken.username;
  
      if (!canEdit) {
        res.status(403);
        next({
          name: "UnauthorizedError",
          message: `User ${username} is not allowed to update Every day`,
        });
      }
  
      const routine = await getRoutineById(routineId);
      if (!routine) {
        return res.status(404).send('Routine not found');
      }
  
      const updatedFields = {};

      if (isPublic) {
        updatedFields.isPublic = isPublic;
      } 
      if (name) {
        updatedFields.name = name;
      }
      if (goal) {
        updatedFields.goal = goal;
      }
      
  console.log(` updatedFields: ${updatedFields}`);
      const updatedRoutine = await updateRoutine({routineId, updatedFields});
      res.send(JSON.stringify(updatedRoutine));
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

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
