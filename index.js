/* eslint-disable no-console */
/* eslint-disable indent */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "morgan";
import router from "./app/config/routes.js";
import databaseConfig from "./app/config/database.js";
import { ERROR_MSG } from "./app/config/messages.js";
import { adminRegister } from "./app/v1/controllers/auth/authController.js";

const app = express();
const environment = process.env.NODE_ENV || "development";
// TODO ++++++++++++++++++++++++++++++
// add compression
// block XSS
// Caching
// validate, body, query, params
// success failed operation
// do proper planning

const envFile = `.env.${environment}`;
dotenv.config({ path: envFile });

const PORT = process.env.PORT || 8000;
const { uri, options } = databaseConfig[environment];


app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/v1", router);

if (environment === "development") {
  app.post("/create", adminRegister);
}

// Error handler
const errorHandler = (err, req, res, next) => {
  res.status(400); // Bad Request
  console.log(err);
  res.json({ errorTitle: "Bad Request", message: err.message || ERROR_MSG.ERROR_OCCURRED });
  next();
};

// Routes not found middleware
const notFoundHandler = (req, res, next) => {
  res.status(404);
  res.json({ message: "Requested Resource not found." });
  next();
};

// Register the error handling middleware and not found middleware
app.use(notFoundHandler);
app.use(errorHandler);

mongoose
  .connect(uri, options)
  .then(() => {
    console.log("DB Connected");
    app.listen(PORT, () => {
      const env = process.env.NODE_ENV;
      console.log(`app running in ${env} mode at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error connecting database \n ${err.message}`);
  });
export { app };
// not use
// const cylinderSchema = new mongoose.Schema({
//   lubrication: {
//     ring1: String,
//     ring2: String,
//     ring3: String,
//     ring4: String
//   },
//   surface: {
//     ring1: String,
//     ring2: String,
//     ring3: String,
//     ring4: String
//   },
//   deposit: {
//     ring1: String,
//     ring2: String,
//     ring3: String,
//     ring4: String
//   },
//   breakage: {
//     ring1: String,
//     ring2: String,
//     ring3: String,
//     ring4: String
//   },
//   image: String,
//   remark: String
// });

