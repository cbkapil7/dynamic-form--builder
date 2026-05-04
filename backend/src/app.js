
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import db from "./models/index.js";
import formRoutes from "./routes/form.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import { seedAdmin } from "./utils/seedAdmin.js";


const app = express();

//  FIX CORS FOR COOKIES
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/auth", authRoutes); 
app.use("/forms", formRoutes);

// error handler
app.use(errorHandler);

db.sequelize.sync().then(async () => {
  await seedAdmin(); 

  app.listen(5000, () => console.log("Server running"));
});