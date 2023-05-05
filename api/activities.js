const express = require("express");
const {
  getRoutineActivitiesByRoutine,
  getAllActivities,
  createActivity,
  updateActivity,
  getActivityById,
  getActivityByName,
  getPublicRoutinesByActivity,
} = require("../db");
const activityRouter = express.Router();
const { requireUser } = require("./utils");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

activityRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

activityRouter.post("/", async (req, res, next) => {
  const { name: activityName, description } = req.body;
  const activityData = { name: activityName, description };
  try {
    const existingActivity = await getActivityByName(activityName);
    if (existingActivity) {
      res.status(401);
      throw {
        name: "AlreadyExists",
        message: `An activity with name ${activityName} already exists`,
      };
    }

    const activity = await createActivity(activityData);
    res.send(activity);
  } catch (error) {
    console.log(error);
    next(error);
  }
});


activityRouter.patch("/:activityId", async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { name, description } = req.body;
    const patchData = { name, description };
    const existingActivity = await getActivityByName(name);

    if (existingActivity) {
      res.status(401);
      return next({
        name: "AlreadyExists",
        message: `An activity with name ${name} already exists`,
      });
    }

    const nonExistantActivity = await getActivityById(activityId);

    if (
      nonExistantActivity.message === "Could not find an activity with that Id"
    ) {
      res.status(404);
      return next({
        name: "ActivityNotFoundError",
        message: "nope",
      });
    }
    // Check if an activity with the same name already exists

    const updatedActivity = await updateActivity({
      id: activityId,
      ...patchData,
    });
    res.send(updatedActivity);
  } catch (error) {
    next(error);
  }
});

activityRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;

  try {
    const nonExistantActivity = await getActivityById(activityId);
    if (
      nonExistantActivity.message === "Could not find an activity with that Id"
    ) {
      res.status(404);
      return next({
        name: "ActivityNotFoundError",
        message: "nope",
      });
    }

    const routines = await getPublicRoutinesByActivity({ id: activityId });

    res.send(routines);
  } catch (error) {
    next(error);
  }
});

module.exports = activityRouter;
