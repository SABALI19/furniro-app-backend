import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./dbConnections/dbConnection.js";
import furnitureRoutes from './routes/furniture.js'
import userRoutes  from "./routes/user.js";


// configure dotenv FIRST
dotenv.config();

// create an instance of express application
const app = express();

//middleware to parse json data
app.use(express.json());

// create simple route/endpoint
app.get("/", (req, res) => {
  res.send("Welcome to Furniro Server");
});

app.get("/about", (req, res) => {
  res.send("Welcome to About us page");
});

//define furniture route 
app.use("/api/furniture", furnitureRoutes);
app.use("/api/user", userRoutes);
//define user route

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

const PORT = process.env.PORT || 5000;

const startSever = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is listening to PORT ${PORT}`);
    });
  } catch (e) {
    console.log(`Server could not connect due to database error: ${e.message}`);
  }
};

// call db connection function
startSever();