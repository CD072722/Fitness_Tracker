const express = require("express");
const usersRouter = express.Router();
const { getAllUsers, getUserByUsername, createUser, getPublicRoutinesByUser, getAllRoutinesByUser } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const bcrypt = require("bcrypt");

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");
  next();
});

usersRouter.get("/", async (req, res) => {
  const users = await getAllUsers();

  res.send({ users });
});

usersRouter.get("/me", async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        // No token provided
        res.status(401);
        next({
          name: "UnauthorizedError",
          message: "You must be logged in to perform this action",
        // Set the status code to 401 (Unauthorized)
        });
      }
  
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const user = await getUserByUsername(decodedToken.username);
  
      if (user) {
        res.send(user);
      } else {
        res.status(401);
        next({
          name: "UnauthorizedError",
          message: "Invalid token",
        // Set the status code to 401 (Unauthorized)
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
  
  usersRouter.get("/:username/routines", async (req, res, next) => {
    try {
      const username = req.params.username;
      const token = req.headers.authorization?.split(" ")[1];
      
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const loggedInUsername = decodedToken.username;
  
      if (loggedInUsername === username) {
        const routines = await getAllRoutinesByUser(username);
        res.send(routines);
      } else {
        const routines = await getPublicRoutinesByUser(username);
        res.send(routines);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
  
 

usersRouter.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
  
    // request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password",
      });
    }
  
    try {
      const user = await getUserByUsername(username);
  
      if (user) {
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
        if (isPasswordCorrect) {
          const token = jwt.sign(
            {
              id: user.id,
              username: user.username,
            },
            JWT_SECRET,
            {
              expiresIn: "1w",
            }
          );
  
          res.send({
            message: "you're logged in!",
            token,
            user: {
              id: user.id,
              username: user.username,
            },
          });
        } else {
          next({
            name: "IncorrectCredentialsError",
            message: "Username or password is incorrect",
          });
        }
      } else {
        next({
          name: "IncorrectCredentialsError",
          message: "Username or password is incorrect",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
  

usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
      const _user = await getUserByUsername(username);
  
      if (_user) {
       
        res.status(401);
        next({
          name: 'UserExistsError',
          message: `User ${username} is already taken.`
        });
       
      }else if (password.length < 8) {
     
        res.status(401);
        next({
           
          name: 'PasswordTooShortError',
          message: 'Password Too Short!'
        });
        
      }else{
        const user = await createUser({
            username,
            password,
           
          });
      
          const token = jwt.sign({ 
            id: user.id, 
            username
          }, process.env.JWT_SECRET, {
            expiresIn: '1w'
          });
      
          res.send({ 
            message: "thank you for signing up",
            token,
            user: {
              id: user.id,
              username: user.username
            }
          });
        
      }
  
    
    } catch (error) {
      console.log(error);
      next(error);
    } 
  });
  
  

module.exports = usersRouter;
