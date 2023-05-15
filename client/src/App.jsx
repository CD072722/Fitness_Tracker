import { useState } from "react";
import { agate } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import "./App.css";

function App() {
  return (
    <div className="App">
      <nav>
        <a href="#top-of-page">Top of page</a>
        <a href="#authentication-through-json-web-tokens">Authentication</a>
        <a href="#general-return-schema">General Return Schema</a>
        <a href="#user-endpoints">User Endpoints</a>
        <ul>
          <li>
            <a href="#-post-api-users-register-">POST /users/register</a>
          </li>
          <li>
            <a href="#-post-api-users-login-">POST /users/login</a>
          </li>
          <li>
            <a href="#-get-api-users-me-">GET /users/me</a>
          </li>
          <li>
            <a href="#-get-api-users-username-routines-">
              GET /users/:username/routines
            </a>
          </li>
        </ul>

        <a href="#activities-endpoints">Activities Endpoints</a>
        <ul>
          <li>
            <a href="#-get-api-activities-">GET /activities</a>
          </li>
          <li>
            <a href="#-post-api-activities-">POST /activities</a>
          </li>
          <li>
            <a href="#-patch-api-activities-activityid-">
              PATCH /activities/:activityId
            </a>
          </li>
          <li>
            <a href="#-get-api-activities-activityid-routines-">
              GET /activities/:activityId/routines
            </a>
          </li>
        </ul>

        <a href="#routines-endpoints">Routines Endpoints</a>
        <ul>
          <li>
            <a href="#-get-api-routines-">GET /routines</a>
          </li>
          <li>
            <a href="#-post-api-routines-">POST /routines</a>
          </li>
          <li>
            <a href="#-patch-api-routines-routineid-">
              PATCH /routines/:routineId
            </a>
          </li>
          <li>
            <a href="#-delete-api-routines-routineid-">
              DELETE /routines/:routineId
            </a>
          </li>
          <li>
            <a href="#-post-api-routines-routineid-activities-">
              POST /routines/:routineId/activities
            </a>
          </li>
        </ul>

        <a href="#routine_activities-endpoints">
          Routine_Activities Endpoints:
        </a>
        <ul>
          <li>
            <a href="#-patch-api-routine_activities-routineactivityid-">
              PATCH /routine_activities/:routineActivityId
            </a>
          </li>
          <li>
            <a href="#-delete-api-routine_activities-routineactivityid-">
              DELETE /routine_activities/:routineActivityId
            </a>
          </li>
        </ul>
      </nav>
      <div className="Body">
        <a>
          <h1 id="top-of-page">FITMATE API Documentation</h1>
        </a>
        <article>
          <h2 id="introduction">Introduction</h2>
          <p>
            Here at FITMATE we strive to provide you with an easy to consume
            API, so you can build out beautiful front end experiences and leave
            the Data management to us.
          </p>
          <p>We have a small handful of endpoints, each documented below.</p>
        </article>

        <article>
          <h2 id="authentication-through-json-web-tokens">
            Authentication through JSON Web Tokens
          </h2>

          <p>
            When using the API, many calls are made in the context of a
            registered user. The API protects itself by requiring a token string
            passed in the Header for requests made in that context.
          </p>
          <p>
            Bearer token variable will come from the function parameters and be
            inserted into the template literal. At runtime this will process as:
          </p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {`'Bearer eyJfaWQiOiI1ZTg5MDY2ZGQ0MzkxNjAwTc1NTNlMDUiLCJ1c2VybmFtZSI6Im1hdHQiLCJpYXQiOjE1ODYwMzgzODF9'`}
          </SyntaxHighlighter>
          <p>A sample request with an authorization token looks like this:</p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {`  
 const someFunction = async (token) => {
  try {
    const response = await fetch(\`\${BASE_URL}/someEndPoint\`, {
      method: \"POST\",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`
      },
      body: JSON.stringify({ /* whatever things you need to send to the API */ })
    });
      const result = await response.json();
      console.log(result);
      return result
  } catch (err) {
    console.error(err);
  }
}         
                    `}
          </SyntaxHighlighter>
          <p>
            It is crucial that the value for Authorization is a string starting
            with Bearer, followed by a space, and finished with the token you
            receive either by registering or logging in. Deviating from this
            format will cause the API to not recognize the token, and will
            result in an error.
          </p>
          <p>
            If the token is malformed, missing, or has been revoked, you will
            get a response specific to that.
          </p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {`{
  "success": false,
  "error": {
    "type": "InvalidToken",
    "message": "Invalid token, please sign up or log in"
    },
    "data": null
}`}
          </SyntaxHighlighter>
        </article>

        <article id="general-return-schema">
          <h2 id="introduction">General Return Schema</h2>
          <p>Failed Request</p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {`  {
    success: false,
    error: 
    {
      name: "ErrorName",
      message: "This is an error message."
    }
    data: null
  }`}
          </SyntaxHighlighter>
          <p>OR</p>
          <p>Successful Request</p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
  {
    success: true,
    error: null,
    data: 
    {
      user: { username: "janesmyth" },
      message: "This is a data message."
    } 
  }
      `}
          </SyntaxHighlighter>
          <p>
            Since a success or error is present in each call, we will only
            discuss the data object returned from the calls described below.
          </p>
        </article>
        <h1 id="user-endpoints">User Endpoints</h1>
        <article id="-post-api-users-register-">
          <h2>POST /users/register</h2>
          <p>
            This route is used to create a new user account. On success, you
            will be given a JSON Web Token to be passed to the server for
            requests requiring authentication.
          </p>
          <h3>Fetch Options</h3>
          <h4>Body:</h4>
          <p>user (object, required)</p>
          <ul>
            <li>
              username (string, required): the desired username for the new user
            </li>
            <li>
              password (string, required): the desired password for the new user
            </li>
          </ul>
          <h4>Returned Data</h4>
          <ul>
            <li>
              token (string): the JSON Web Token which is used to authenticate
              the user with any future calls
            </li>
            <li>message (string): Thanks for signing up for our service.</li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
 const registerUser = async () => {
  try {
    const response = await fetch(
      \`\${BASE_URL}/users/register\`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          username: 'superman27',
          password: 'krypt0n0rbust'
        }
      })
    });
    const result = await response.json();
    // As written below you can log your result
    // to check what data came back from the above code.
    console.log(result)
    return result
  } catch (err) {
    console.error(err);
  }
}
      `}
          </SyntaxHighlighter>
          <h4>Sample Result</h4>
          <p>
            If the API creates a new user, the following object will be
            returned:
          </p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
  {
    "success": true,
    "error": null,
    "data": {
      "token": "xyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTg5MDY2ZGQ0MzkxNjAwTc1NTNlMDUiLCJ1c2VybmFtZSI6Im1hdHQiLCJpYXQiOjE1ODYwMzgzODF9.CTj4owBl0PB-G6G4E_1l6DS6_cVc0iKcMzBIWFUYM1p",
      "message": "Thanks for signing up for our service."
    }
  }
      `}
          </SyntaxHighlighter>
        </article>
        <article id="-post-api-users-login-">
          <h2>POST /users/login</h2>
          <p>
            This route is used for a user to login when they already have an
            account. On success, you will be given a JSON Web Token to be passed
            to the server for requests requiring authentication.
          </p>
          <h3>Fetch Options</h3>
          <h4>Body:</h4>
          <p>(object, required) contains the following key/value pairs:</p>
          <ul>
            <li>
              username (string, required): the registered username for the user
            </li>
            <li>
              password (string, required): the matching password for the user
            </li>
          </ul>
          <h4>Return Data</h4>
          <ul>
            <li>
              token (string): the JSON Web Token which is used to authenticate
              the user with any future calls
            </li>
            <li>message (string): Thanks for logging in to our service.</li>
            <li>
              user (object) which contains the following key/value pairs:
              <ul>
                <li>id (number): the database identifier of the user</li>
                <li>username (string): the username of the user</li>
              </ul>
            </li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
  const login = async () => {
      
    try {
      const response = await fetch(\`\${BASE_URL}/users/login\`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'superman27',
            password: 'krypt0n0rbust'
        })
      });
      const result = await response.json();
      console.log(result);
      return result
    } catch (err) {
      console.error(err);
    }
}
      
      `}
          </SyntaxHighlighter>
          <h4>Sample Result</h4>
          <p>
            This API route attempts to authenticate using the username and
            password, if successful, something similar to following object will
            be in the result:
          </p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
{
  "user": 
    {
      "id": 5,
      "username": superman27,
    }
  "message": "you're logged in!"
  "token": "xyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTg5MDY2ZGQ0MzkxNjAwTc1NTNlMDUiLCJ1c2VybmFtZSI6Im1hdHQiLCJpYXQiOjE1ODYwMzgzODF9.CTj4owBl0PB-G6G4E_1l6DS6_cVc0iKcMzBIWFUYM1p",
}
      `}
          </SyntaxHighlighter>
        </article>
        <article id="-get-api-users-me-">
          <h2>GET /users/me</h2>
          <p>
            This route is used to grab an already logged in user's relevant
            data. It is mostly helpful for verifying the user has a valid token
            (and is thus logged in). You must pass a valid token with this
            request, or it will be rejected.
          </p>
          <h3>Fetch Options</h3>
          <h4>Headers:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>Content-Type (string, required): application/json</li>
            <li>
              Authorization (template literal, required): Bearer
              {"${TOKEN_STRING_HERE}"}
            </li>
          </ul>
          <h4>Return Data</h4>
          <p>(object)</p>
          <ul>
            <li>id (string): the database identifier of the user</li>
            <li>username (string): the username of the user</li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
  const myData = async () => {
  try {
    const response = await fetch(\`\${BASE_URL}/users/me\`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${TOKEN_STRING_HERE}\`
      },
    });
    const result = await response.json();
    console.log(result);
    return result
  } catch (err) {
    console.error(err);
  }
}
      
      
      `}
          </SyntaxHighlighter>
          <h4>Sample Result</h4>

          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
{  
  "id": "5",
  "username": "superman27",
}
    
      `}
          </SyntaxHighlighter>
        </article>
        <p>
          This route is used to grab an already logged in user's relevant data.
          It is mostly helpful for verifying the user has a valid token (and is
          thus logged in). You must pass a valid token with this request, or it
          will be rejected.
        </p>
        <h4>Request Parameters</h4>
        <p>No request parameters are necessary for this route.</p>
        <h4>Return Parameters</h4>
        <ul>
          <li>id (number): the database identifier of the user</li>
          <li>username (string): the username of the user</li>
        </ul>
        <h4>Sample Call</h4>
        <SyntaxHighlighter language="javascript" style={agate}>
          {` 
fetch('http://fitnesstrac-kr.herokuapp.com/api/users/me', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN_STRING_HERE'
  },
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);
    
      `}
        </SyntaxHighlighter>
        <p>Sample Response</p>
        <SyntaxHighlighter language="javascript" style={agate}>
          {` 
{
  "id": 5,
  "username": "superman27"
}
    
      `}
        </SyntaxHighlighter>

        <article id="-get-api-users-username-routines-">
          <h2>GET /users/:username/routines</h2>
          <p>
            This route returns a list of public routines for a particular user.
            If a token is sent in the Authorization header (and if this token's
            logged in user matches the user for which these routines are being
            requested), both public and private routines will be sent back for
            the requested user.
          </p>
          <h3>Fetch Options</h3>
          <h4>Headers: (optional)</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>Content-Type (string, required): application/json</li>
            <li>
              Authorization (template literal, required): Bearer
              {"${TOKEN_STRING_HERE}"}
            </li>
          </ul>
          <h4>Return Data</h4>
          <p>
            (array of objects): each object should contain the following
            key/value pairs:
          </p>
          <ul>
            <li>
              id (number): This is the database identifier for the routine
              object.
            </li>
            <li>
              creatorId (number): This is the database identifier for the user
              which created this routine
            </li>
            <li>
              creatorName (string): This is the username for the user which
              created this routine
            </li>
            <li>
              isPublic (boolean): Whether or not the routine should be visible
              to all users (will always be true for public routes)
            </li>
            <li>name (string): This is the name (or title) of the routine.</li>
            <li>goal (string): This is like the description of the routine.</li>
            <li>
              activity (array of activity objects): An array of activities
              associated with this routine.
              <ul>
                <li>
                  id (number): This is the database identifier for the activity
                </li>
                <li>
                  name (string): This is the name (or title) of the activity.
                </li>
                <li>
                  description (string): This is the description of the activity.
                </li>
                <li>
                  duration (number): This is how long (in minutes) this activity
                  should be performed for this routine.
                </li>
                <li>
                  count (number): This is the number of times (reps) this
                  activity should be performed for this routine.
                </li>
                <li>
                  routineActivityId (number): This is the database identifier
                  for the routine_activity
                </li>
                <li>
                  routineId (number): This is the database identifier for the
                  routine
                </li>
              </ul>
            </li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
const myData = async () => {

  try {
    const response = await fetch(\`\${BASE_URL}/users/albert/routines\`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${TOKEN_STRING_HERE}\`
      },
    });
    const result = await response.json();
    console.log(result);
    return result
  } catch (err) {
    console.error(err);
  }
}
      
      `}
          </SyntaxHighlighter>
          <h4>Sample Response</h4>

          <SyntaxHighlighter language="javascript" style={agate}>
            {` 

[
  {
    "id": 2,
    "creatorId": 1,
    "isPublic": true,
    "name": "Chest Day",
    "goal": "To beef up the Chest and Triceps!",
    "creatorName": "albert",
    "activities": 
    [
      {
        "id": 3,
        "name": "bench press",
        "description": "3 sets of 10. Lift a safe amount, but push yourself!",
        "duration": 8,
        "count": 10,
        "routineActivityId": 6,
        "routineId": 2
      },
      {
        "id": 32,
        "name": "skull crushers",
        "description": "don't drop the weight!",
        "duration": 8,
        "count": 10,
        "routineActivityId": 8,
        "routineId": 2
    },
    ]
  },
  {
    "id": 3,
    "creatorId": 1,
    "isPublic": false,
    "name": "Leg Day",
    "goal": "Leg day is best day!",
    "creatorName": "albert",
    "activities": 
    [
      {
        "id": 5,
        "name": "Squats",
        "description": "More weight!",
        "duration": 7,
        "count": 10,
        "routineActivityId": 8,
        "routineId": 2
      }, 
    ]
  },
  
]
      `}
          </SyntaxHighlighter>
        </article>
        <h2 id="activities-endpoints">Activities Endpoints</h2>
        <article id="-get-api-activities-">
          <h2>GET /activities</h2>
          <p>Returns a list of all activities in the database</p>

          <h4>Headers:</h4>
          <p>No token is necessary in the header for this route.</p>

          <h4>Return Data</h4>
          <p>(array of objects)</p>
          <ul>
            <li>
              id (number): This is the database identifier for the activity
            </li>
            <li>name (string): This is the name (or title) of the activity.</li>
            <li>
              description (string): This is the description of the activity.
            </li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
const myData = async () => {
  try {
    const response = await fetch(\`\${BASE_URL}/activities\`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    console.log(result);
    return result
  } catch (err) {
    console.error(err);
  }
}
      
      `}
          </SyntaxHighlighter>
          <h4>Sample Response</h4>

          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
[
  {
      "id": 2,
      "name": "Incline Dumbbell Hammer Curl",
      "description": "Lie down face up on an incline bench and lift thee barbells slowly upward toward chest"
  },
  {
      "id": 3,
      "name": "bench press",
      "description": "Lift a safe amount, but push yourself!"
  },
  {
      "id": 4,
      "name": "Push Ups",
      "description": "Pretty sure you know what to do!"
  },
  {
      "id": 5,
      "name": "squats",
      "description": "Heavy lifting."
  },
  {
      "id": 6,
      "name": "treadmill",
      "description": "running"
  },
  {
      "id": 7,
      "name": "stairs",
      "description": "climb those stairs"
  },
  {
      "id": 8,
      "name": "elliptical",
      "description": "using the elliptical machine"
  },
  {
      "id": 1,
      "name": "standing barbell curl",
      "description": "Lift that barbell!"
  }
]

      `}
          </SyntaxHighlighter>
        </article>
        <article id="-post-api-activities-">
          <h2>POST /activities</h2>
          <p>
            A request to this endpoint will attempt to create a new activity.
            You must pass a valid token with this request, or it will be
            rejected.
          </p>

          <h4>Headers:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>Content-Type (string, required): application/json</li>
            <li>
              Authorization (template literal, required): Bearer
              {"${TOKEN_STRING_HERE}"}
            </li>
          </ul>
          <h4>Request Parameters:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>
              name (string, required): the desired name for the new activity
            </li>
            <li>
              description (string, required): the desired description for the
              new activity
            </li>
          </ul>
          <h4>Return Data:</h4>
          <p>(object literal)</p>
          <ul>
            <li>
              id (number): This is the database identifier for the activity
            </li>
            <li>name (string): This is the name (or title) of the activity.</li>
            <li>
              description (string): This is the description of the activity.
            </li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
const myData = async () => {
  try {
    const response = await fetch(\`\${BASE_URL}/activities\`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Running',
        description: 'Keep on running!'
      }) 
    });

    const result = await response.json();

    console.log(result);
    return result
  } catch (err) {
    console.error(err);
  }
}
      
      
      `}
          </SyntaxHighlighter>
          <h4>Sample Response</h4>
          <p>
            If the API creates a new activity, the following object will be
            returned:
          </p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
{
  "id": 9,
  "name": "Running",
  "description": "Keep on running!"
}
      `}
          </SyntaxHighlighter>
        </article>
        <article id="-patch-api-activities-activityid-">
          <h2>PATCH /activities/:activityId</h2>
          <p>
            Anyone can update an activity (yes, this could lead to long term
            problems)
          </p>

          <h4>Headers:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>Content-Type (string, required): application/json</li>
            <li>
              Authorization (template literal, required): Bearer
              {"${TOKEN_STRING_HERE}"}
            </li>
          </ul>
          <h4>Request Parameters:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>
              name (string, optional): the desired new name for the activity
            </li>
            <li>
              description (string, optional): the desired new description for
              the activity.
            </li>
          </ul>
          <h4>Return Data:</h4>
          <p>(object literal)</p>
          <ul>
            <li>
              id (number): This is the database identifier for the activity
            </li>
            <li>name (string): This is the name (or title) of the activity.</li>
            <li>
              description (string): This is the description of the activity.
            </li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
 const myData = async () => {
  try {
    const response = await fetch(\`\${BASE_URL}/activities\`, {
      headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${TOKEN_STRING_HERE}\`
      },
      method: "PATCH",
      body: JSON.stringify({
        name: 'Running',
        description: 'Keep on running, til you drop!'
      })
    });

      const result = await response.json();
      console.log(result);
      return result
    } catch (err) {
    console.error(err);
    }
}
   
      
      `}
          </SyntaxHighlighter>
          <h4>Sample Response</h4>
          <p>
            If the API successfully edits the activity, the following object
            will be returned:
          </p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
{
  "id": 9,
  "name": "Running",
  "description": "Keep on running, til you drop!"
}
  
      `}
          </SyntaxHighlighter>
        </article>
        <article id="-get-api-activities-activityid-routines-">
          <h2>GET /api/activities/:activityId/routines</h2>
          <p>
            This route returns a list of public routines which feature that
            activity
          </p>
          <h3>Headers:</h3>

          <p>no additional headers are necessary</p>
          <h3>Request Parameters:</h3>
          <p>no request parameters are required</p>
          <h3>Return Data</h3>
          <p>
            an array of objects; each object should have the following layout:
          </p>
          <ul>
            <li>
              id (number): This is the database identifier for the routine
              object.
            </li>
            <li>
              creatorId (number): This is the database identifier for the user
              which created this routine
            </li>
            <li>
              creatorName (string): This is the username for the user which
              created this routine
            </li>
            <li>
              isPublic (boolean): Whether or not the routine should be visible
              to all users (will always be true for public routes)
            </li>
            <li>name (string): This is the name (or title) of the routine.</li>
            <li>goal (string): This is like the description of the routine.</li>
            <li>
              activity (array of activity objects): An array of activities
              associated with this routine.
              <ul>
                <li>
                  id (number): This is the database identifier for the activity
                </li>
                <li>
                  name (string): This is the name (or title) of the activity.
                </li>
                <li>
                  description (string): This is the description of the activity.
                </li>
                <li>
                  duration (number): This is how long (in minutes) this activity
                  should be performed for this routine.
                </li>
                <li>
                  count (number): This is the number of times (reps) this
                  activity should be performed for this routine.
                </li>
                <li>
                  routineActivityId (number): This is the database identifier
                  for the routine_activity
                </li>
              </ul>
            </li>
          </ul>

          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {`
const myData = async () => {
  try {
    const response = await fetch(\`\${BASE_URL}/activities/3/routines\`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    console.log(result);
    return result
  } catch (err) {
    console.error(err);
  }
}`}
          </SyntaxHighlighter>
          <h4>Sample Response</h4>

          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
[
  {
    "id": 2,
    "creatorId": 1,
    "isPublic": true,
    "name": "Chest Day",
    "goal": "To beef up the Chest and Triceps!",
    "creatorName": "albert",
    "activities": [
        {
          "id": 3,
          "name": "bench press",
          "description": "Lift a safe amount, but push yourself!",
          "duration": 8,
          "count": 10,
          "routineActivityId": 6,
          "routineId": 2
        },
        {
          "id": 4,
          "name": "Push Ups",
          "description": "Pretty sure you know what to do!",
          "duration": 7,
          "count": 10,
          "routineActivityId": 7,
          "routineId": 2
        },
    ]
  }
]
      `}
          </SyntaxHighlighter>
        </article>
        <h2 id="routines-endpoints">Routines Endpoints</h2>
        <article id="-get-api-routines-">
          <h2>GET /routines</h2>
          <p>This route returns a list of all public routines</p>
          <h3>Headers:</h3>
          <p>no additional headers are necessary</p>
          <h3>Request Parameters:</h3>
          <p>no request parameters are required</p>
          <h3>Return Data</h3>
          <p>
            an array of objects; each object should have the following layout:
          </p>
          <ul>
            <li>
              id (number): This is the database identifier for the routine
              object.
            </li>
            <li>
              creatorId (number): This is the database identifier for the user
              which created this routine
            </li>
            <li>
              creatorName (string): This is the username for the user which
              created this routine
            </li>
            <li>
              isPublic (boolean): Whether or not the routine should be visible
              to all users (will always be true for public routes)
            </li>
            <li>name (string): This is the name (or title) of the routine.</li>
            <li>goal (string): This is like the description of the routine.</li>
            <li>
              activity (array of activity objects): An array of activities
              associated with this routine.
              <ul>
                <li>
                  id (number): This is the database identifier for the activity
                </li>
                <li>
                  name (string): This is the name (or title) of the activity.
                </li>
                <li>
                  description (string): This is the description of the activity.
                </li>
                <li>
                  duration (number): This is how long (in minutes) this activity
                  should be performed for this routine.
                </li>
                <li>
                  count (number): This is the number of times (reps) this
                  activity should be performed for this routine.
                </li>
                <li>
                  routineActivityId (number): This is the database identifier
                  for the routine_activity
                </li>
                <li>
                  routineId (number): This is the database identifier for the
                  routine
                </li>
              </ul>
            </li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
const myData = async () => {
  try {
  const response = await fetch(\`\${BASE_URL}/routines\`, {
    headers: {
    'Content-Type': 'application/json',
    },
  });
  
  const result = await response.json();
  console.log(result);
  return result
  } catch (err) {
  console.error(err);
  }
}
      
      
      `}
          </SyntaxHighlighter>
          <h4>Sample Response</h4>

          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
[
  {
  "id": 2,
  "creatorId": 1,
  "isPublic": true,
  "name": "Chest Day",
  "goal": "To beef up the Chest and Triceps!",
  "creatorName": "albert",
  "activities": [
      {
          "id": 3,
          "name": "bench press",
          "description": "Lift a safe amount, but push yourself!",
          "duration": 8,
          "count": 10,
          "routineActivityId": 6,
          "routineId": 2
      },
      {
          "id": 4,
          "name": "Push Ups",
          "description": "Pretty sure you know what to do!",
          "duration": 7,
          "count": 10,
          "routineActivityId": 7,
          "routineId": 2
      }
  ]
  },
  {
  "id": 4,
  "creatorId": 2,
  "isPublic": true,
  "name": "Cardio Day",
  "goal": "Running, stairs. Stuff that gets your heart pumping!",
  "creatorName": "sandra",
  "activities": [
      {
          "id": 6,
          "name": "treadmill",
          "description": "running",
          "duration": 10,
          "count": 10
      },
      {
          "id": 7,
          "name": "stairs",
          "description": "climb those stairs",
          "duration": 15,
          "count": 10
      }
  ]
  },
  ]
      `}
          </SyntaxHighlighter>
        </article>
        <article id="-post-api-routines-">
          <h2>POST /routines</h2>
          <p>
            A request to this endpoint will attempt to create a new routine. You
            must pass a valid token with this request, or it will be rejected.
          </p>

          <h4>Headers:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>Content-Type (string, required): application/json</li>
            <li>
              Authorization (template literal, required): Bearer
              {"${TOKEN_STRING_HERE}"}
            </li>
          </ul>
          <h4>Request Parameters:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>
              name (string, required): the desired name for the new routines
            </li>
            <li>
              goal (string, required): the desired goal description of the
              routine.
            </li>
            <li>
              isPublic (boolean, optional): Whether or not the routine should be
              visible to all users. null by default
            </li>
          </ul>
          <h4>Return Data:</h4>
          <p>(an array containing objects)</p>
          <ul>
            <li>
              id (number): This is the database identifier for the routine
            </li>
            <li>name (string): This is the name (or title) of the routine.</li>
            <li>goal (string): This is like the description of the routine.</li>
            <li>
              creatorId (number): This is the database identifier for the user
              which created this routine
            </li>
            <li>
              isPublic (boolean): Whether or not the routine should be visible
              to all users. null by default
            </li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
const myData = async () => {
  try {
    const response = await fetch(\`\${BASE_URL}/routines\`, {
      method: "POST",
      headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${TOKEN_STRING_HERE}\`
      },
      body: JSON.stringify({
        name: 'Long Cardio Routine',
        goal: 'To get your heart pumping!',
        isPublic: true
      })
    });
    const result = await response.json();
    console.log(result);
    return result
  } catch (err) {
    console.error(err);
  }
}
      `}
          </SyntaxHighlighter>
          <h4>Sample Response</h4>
          <p>
            If the API successfully creates a new routine, it should return an
            object that looks similar to the following:
          </p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
{
  "id": 8,
  "creatorId": 2,
  "isPublic": true,
  "name": "Long Cardio Routine",
  "goal": "To get your heart pumping!"
}
      `}
          </SyntaxHighlighter>
        </article>
        <article id="-patch-api-routines-routineid-">
          <h2>PATCH /routines/:routineId</h2>
          <p>
            Update a routine, notably change public/private, the name, or the
            goal. A token needs to be sent in the header in order for this
            request to be successful.
          </p>
          <h4>Headers:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>Content-Type (string, required): application/json</li>
            <li>
              Authorization (template literal, required): Bearer
              {"${TOKEN_STRING_HERE}"}
            </li>
          </ul>
          <h4>Request Parameters:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>
              name (string, required): the desired name for the new routines
            </li>
            <li>
              goal (string, required): the desired goal description of the
              routine.
            </li>
            <li>
              isPublic (boolean, optional): Whether or not the routine should be
              visible to all users. null by default
            </li>
          </ul>
          <h4>Return Data:</h4>
          <p>(object)</p>
          <ul>
            <li>
              id (number): This is the database identifier for the routine
            </li>
            <li>name (string): This is the name (or title) of the routine.</li>
            <li>goal (string): This is like the description of the routine.</li>
            <li>
              creatorId (number): This is the database identifier for the user
              which created this routine
            </li>
            <li>
              isPublic (boolean): Whether or not the routine should be visible
              to all users. null by default
            </li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
const myData = async () => {
  try {
    const response = await fetch(\`\${BASE_URL}/routines/6\`, {
      method: "PATCH",
      headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${TOKEN_STRING_HERE}\`
      },
      body: JSON.stringify({
        name: 'Long Cardio Day',
        goal: 'To get your heart pumping!'
      })
    });
    const result = await response.json();
    console.log(result);
    return result
  } catch (err) {
    console.error(err);
  }
}  
      `}
          </SyntaxHighlighter>
          <h4>Sample Response</h4>
          <p>
            If the API successfully edits the routine, it should return an
            object that looks similar to the following:
          </p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
{
  "id": 6,
  "creatorId": 2,
  "isPublic": true,
  "name": "Long Cardio Day",
  "goal": "To get your heart pumping!"
}
      `}
          </SyntaxHighlighter>
        </article>
        <article id="-delete-api-routines-routineid-">
          <h2>DELETE /routines/:routineId</h2>
          <p>
            Hard delete a routine. Make sure to delete all the routineActivities
            whose routine is the one being deleted.
          </p>
          <p>
            This endpoint will hard delete a routine whose id is equal to
            routineId. Will also delete all the routineActivities whose routine
            is the one being deleted. The request will be rejected if it is
            either missing a valid token, or if the user represented by the
            token is not the user that created the original routine.
          </p>
          <h4>Headers:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>Content-Type (string, required): application/json</li>
            <li>
              Authorization (template literal, required): Bearer
              {"${TOKEN_STRING_HERE}"}
            </li>
          </ul>
          <h4>Request Parameters:</h4>
          <p>There are no request parameters.</p>

          <h4>Return Data:</h4>
          <p>(object)</p>
          <ul>
            <li>success (boolean): Will be true if the routine was deleted</li>
            <li>
              id (number): This is the database identifier for the routine
            </li>
            <li>name (string): This is the name (or title) of the routine.</li>
            <li>goal (string): This is like the description of the routine.</li>
            <li>
              creatorId (number): This is the database identifier for the user
              which created this routine
            </li>
            <li>
              isPublic (boolean): Whether or not the routine should be visible
              to all users. null by default
            </li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
const myData = async () => {
  try {
    const response = await fetch(\`\${BASE_URL}/routines/6\`, {
      method: "DELETE",
      headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${TOKEN_STRING_HERE}\`
      },
    });
    const result = await response.json();
    console.log(result);
    return result
  } catch (err) {
    console.error(err);
  }
}
   
      `}
          </SyntaxHighlighter>
          <h4>Sample Response</h4>
          <p>
            If the API successfully deletes routine, then it should return an
            object that is similar to the following:
          </p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
{
  "success": true,
  "id": 6,
  "creatorId": 2,
  "isPublic": true,
  "name": "Long Cardio Day",
  "goal": "To get your heart pumping!"
}
      `}
          </SyntaxHighlighter>
        </article>
        <article id="-post-api-routines-routineid-activities-">
          <h2>POST /routines/:routineId/activities</h2>
          <p>
            Attaches a single activity to a routine. Prevents duplication on
            (routineId, activityId) pair. This route does NOT require a token to
            be sent in the headers.
          </p>

          <h4>Headers:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>Content-Type (string, required): application/json</li>
          </ul>
          <h4>Request Parameters:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>
              activityId (number): This is the database identifier for the
              activity
            </li>
            <li>
              count (number): This is the number of times (reps) this activity
              should be performed for this routine.
            </li>
            <li>
              duration (number): This is how long (in minutes) this activity
              should be performed for this routine.
            </li>
          </ul>
          <h4>Return Data:</h4>
          <p>(object)</p>
          <ul>
            <li>
              id (number): This is the database identifier for the
              routine_activity
            </li>
            <li>
              routineId (number): This is the database identifier for the
              routine
            </li>
            <li>
              activityId (number): This is the database identifier for the
              activity
            </li>
            <li>
              count (number): This is the number of times (reps) this activity
              should be performed for this routine.
            </li>
            <li>
              duration (number): This is how long (in minutes) this activity
              should be performed for this routine.
            </li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
const myData = async () => {
  try {
    const response = await fetch(\`\${BASE_URL}/routines/6/activities\`, {
      method: "POST",
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activityId: 7,
        count: 1, 
        duration: 20
      })
    });
    const result = await response.json();
    console.log(result);
    return result
  } catch (err) {
    console.error(err);
  }
}
    
      `}
          </SyntaxHighlighter>
          <h4>Sample Response</h4>
          <p>
            If the API associates the activity with the routine, then it should
            return an object that is similar to the following:
          </p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
{
  "id": 11,
  "routineId": 6,
  "activityId": 7,
  "duration": 20,
  "count": 1
}
      `}
          </SyntaxHighlighter>
        </article>
        <h2 id="routine_activities-endpoints">Routine_activities Endpoints</h2>
        <article id="-patch-api-routine_activities-routineactivityid-">
          <h2>PATCH /routine_activities/:routineActivityId</h2>
          <p>
            Update the count or duration on the routine activity. A token needs
            to be sent in the header in order for this request to be successful.
          </p>

          <h4>Headers:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>Content-Type (string, required): application/json</li>
            <li>
              Authorization (template literal, required): Bearer
              {"${TOKEN_STRING_HERE}"}
            </li>
          </ul>
          <h4>Request Parameters:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>
              count (number, optional): This is the number of times (reps) this
              activity should be performed for this routine.
            </li>

            <li>
              duration (number): This is how long (in minutes) this activity
              should be performed for this routine.
            </li>
          </ul>
          <h4>Return Data:</h4>
          <p>(object)</p>
          <ul>
            <li>
              id (number): This is the database identifier for the
              routine_activity
            </li>
            <li>
              routineId (number): This is the database identifier for the
              routine
            </li>
            <li>
              activityId (number): This is the database identifier for the
              activity
            </li>
            <li>
              count (number): This is the number of times (reps) this activity
              should be performed for this routine.
            </li>
            <li>
              duration (number): This is how long (in minutes) this activity
              should be performed for this routine.
            </li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
const myData = async () => {
  try {
    const response = await fetch(\`\${BASE_URL}/routine_activities/11\`, {
      method: "PATCH",
      headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${TOKEN_STRING_HERE}\`
      },
      body: JSON.stringify({
        count: 2,
        duration: 30
      })
    });
    const result = await response.json();
    console.log(result);
    return result
  } catch (err) {
    console.error(err);
  }
}
   
      `}
          </SyntaxHighlighter>
          <h4>Sample Response</h4>
          <p>
            If the API successfully edits the routine, an object will be
            returned that is similar to the following:
          </p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
{
  "id": 11,
  "routineId": 6,
  "activityId": 7,
  "duration": 30,
  "count": 2
}  
      `}
          </SyntaxHighlighter>
        </article>
        <article id="-delete-api-routine_activities-routineactivityid-">
          <h2>DELETE /routine_activities/:routineActivityId</h2>
          <p>
            Remove an activity from a routine (hard deleting routine_activity),
            dissociating an activity from a routine. A token needs to be sent in
            the header in order for this request to be successful.
          </p>

          <h4>Headers:</h4>
          <p>(object literal, required)</p>
          <ul>
            <li>Content-Type (string, required): application/json</li>
            <li>
              Authorization (template literal, required): Bearer
              {"${TOKEN_STRING_HERE}"}
            </li>
          </ul>
          <h4>Request Parameters:</h4>
          <p>(None are required)</p>

          <h4>Return Data:</h4>
          <p>(object)</p>
          <ul>
            <li>
              success (boolean): Will be true if the routine_activity was
              deleted
            </li>
            <li>
              id (number): This is the database identifier for the
              routine_activity
            </li>
            <li>
              routineId (number): This is the database identifier for the
              routine
            </li>
            <li>
              activityId (number): This is the database identifier for the
              activity
            </li>
            <li>
              count (number): This is the number of times (reps) this activity
              should be performed for this routine.
            </li>
            <li>
              duration (number): This is how long (in minutes) this activity
              should be performed for this routine.
            </li>
          </ul>
          <h4>Sample Call</h4>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
const myData = async () => {
  try {
    const response = await fetch(\`\${BASE_URL}/routine_activities/11\`, {
      headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${TOKEN_STRING_HERE}\`
      },
    });
    const result = await response.json();
    console.log(result);
    return result
  } catch (err) {
    console.error(err);
  }
}
   
   
      `}
          </SyntaxHighlighter>
          <h4>Sample Response</h4>
          <p>
            If the API successfully deletes the routine_activity, an object will
            be returned that is similar to the following:
          </p>
          <SyntaxHighlighter language="javascript" style={agate}>
            {` 
{
  "success": true,
  "id": 11,
  "routineId": 6,
  "activityId": 7,
  "duration": 25,
  "count": 1
}
      `}
          </SyntaxHighlighter>
        </article>
      </div>
    </div>
  );
}

export default App;
