const express = require('express');
const { getRoutineActivitiesByRoutine, getAllActivities, createActivity, updateActivity, getActivityById, getActivityByName } = require('../db');
const activityRouter = express.Router();
const {requireUser}= require("./utils")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;


activityRouter.get("/activities/:activityId/routines", async(req, res, next)=>{
    const {activityId}= req.params;
        const {name, description}= req.body
    try{
        const getRoutineByActivityId=await getRoutineActivitiesByRoutine({ id });
        

    
    res.send({getRoutineByActivityId})
    }
    catch ({ name, message }) {
      
        next({
          name: "MissingCredentialsError",
          message: "Please supply both a username and password"
        })
      }
})
// GET /api/activities
activityRouter.get("/", async(req, res, next)=>{
    try{
        activities= await getAllActivities()
res.send (activities)
 }
 catch (error) {
   console.log(error)
  }})
// POST /api/activities
activityRouter.post("/",  async(req, res, next)=>{
    const {name, description}=req.body;
    const activityData={name, description}
    try{   
        const name=await getActivityByName(name)
        if(name){
            res.status(401)
            next({
                name: "AlreadyExists",
            message: "activity already exists."
            })
        }
    const activity=await createActivity(activityData)
        res.send(activity)

    }
    catch (error) {
        console.log(error)
       }})

// PATCH /api/activities/:activityId
activityRouter.patch("/:activityId",  async(req, res, next)=>{
    const {activityId}= req.params
    const{name, description}=req.body
    const patchData={name, description}
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const username = decodedToken.username;
 
    try{
        const activity= await getActivityById(activityId)
        if (!activity) {
            res.status(404).send('Activity not found');
        } // <- Add this closing brace
        const updatedActivity=await updateActivity(userId, patchData)
     
        console.log(updatedActivity)
        res.send(updatedActivity)
    }
    catch (error) {
        console.log(error)
        // You should also call `next` to pass the error to the error handling middleware
        next(error)
    }})
module.exports = activityRouter;
