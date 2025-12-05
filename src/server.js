import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./dbConnections/dbConnection.js";
// create an instance of express application
const app = express();

// configure dotenv
dotenv.config();

// call server to listen to PORT
const PORT = process.env.PORT;

// reate simple route/endpoint
app.get("/", (req, res) => {
  res.send("Welcome to Furniro Server");
});
app.get("/about", (req, res) => {
  res.send("Welcome to About us page");
});

const startSever = async () => {
  try {
    await connectDB();
    app.listen(PORT, async () => {
      console.log(`Server is listening to PORT ${PORT}`);
    });
  } catch (e) {
    console.log(`Sever could not connect due to database error: ${e.message}`);
  }
};

// call db connection function
startSever();