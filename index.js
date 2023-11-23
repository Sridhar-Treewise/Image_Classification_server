/* eslint-disable indent */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "morgan";
import router from "./app/config/routes.js";
import databaseConfig from "./app/config/database.js";
import { adminRegister } from "./app/v1/controllers/auth/authController.js";
import { connectToDatabase } from "./app/config/connection.js";
import { errorHandler, notFoundHandler } from "./app/common/handler.js";
import { handleStripeWebHooks } from "./app/v1/strip/stripRouter.js";


const app = express();
const environment = process.env.NODE_ENV || "development";
// TODO ++++++++++++++++++++++++++++++
// add compression
// block XSS
// Caching
// clustering
// connection pool
// TODO +++++++++++++++++++++++++++++


const envFile = `.env.${environment}`;
dotenv.config({ path: envFile });

const PORT = process.env.PORT || 8000;
const { uri = "", options } = databaseConfig[environment];


app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
// app.use(setCaching);

// Routes
app.use("/api/v1", router);
app.post("/webhooks", handleStripeWebHooks);

if (environment === "development") {
  app.post("/create", adminRegister);
}


// Register the error handling middleware and not found middleware
app.use(notFoundHandler);
app.use(errorHandler);

connectToDatabase(uri, options, PORT, app, environment);

export { app };
