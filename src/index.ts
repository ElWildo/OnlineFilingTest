import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./services/database.service.js";
import { router } from "./routes/router.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

connectToDatabase()
  .then(() => {
    app.use("", router);
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
