import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./dbConnections/dbConnection.js";
import furnitureRoutes from "./routes/furniture.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/orderRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
// create an instance of express application
const app = express();

// middleware to parse json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// configure dotenv
dotenv.config();

// call server to listen to PORT
const PORT = process.env.PORT;

// create simple route/endpoint
app.get("/", (req, res) => {
  res.send("Welcome to Furniro Server");
});

//configure server to serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

//configure uploads via env variable(for the use of Render disk mount path feature when in production)
const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(PROJECT_ROOT, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOADS_DIR));
 
//define routes
app.use("/api/furniture", furnitureRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);

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
