require("dotenv").config();
const express = require("express");
const app = express();
const client = require("./db/client");
const cors = require("cors");
const path = require("path");

client.connect();

app.use(cors());
const morgan = require("morgan");
app.use(morgan("dev"));

app.use(express.json());

const apiRouter = require("./api");
app.use(express.static(path.join(__dirname, "./client/dist")));
app.use("/api", apiRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist", "index.html"));
});
// error handling middleware
app.use((error, req, res, next) => {
  if (res.statusCode < 400) res.status(500);
  res.send({
    error: error.message,
    name: error.name,
    message: error.message,
    table: error.table,
  });
});

app.use((error, req, res, next) => {
  res.sendFile(path.join(__dirname, "./client/dist", "index.html"));
});

app.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});