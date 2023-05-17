/* eslint-disable no-console */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "morgan";
import createError from "http-errors";
// import multer from "multer";
import router from "./app/config/routes.js";
import databaseConfig from "./app/config/database.js";

const app = express();
const environment = process.env.NODE_ENV || "development";

const envFile = `.env.${environment}`;
dotenv.config({ path: envFile });

const PORT = process.env.PORT || 8000;
const { uri, options } = databaseConfig[environment];


app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
// const upload = multer({ storage });
// app.post("/upload-profile-image", (req, res) => {
//   console.log("here")
//   try {
//     console.log(req.file);
//     res.status(200).json({ message: "successful" });
//   } catch (err) {
//     console.log("err", err);
//   }
// });


// Routes
app.use("/api/v1", router);

// Error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message });
});

mongoose
  .connect(uri, options)
  .then(() => {
    console.log("DB Connected");
    app.listen(PORT, () => {
      const env = process.env.NODE_ENV;
      console.log(`Server is running in ${env} mode at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error connecting database \n ${err.message}`);
  });

// not use
const cylinderSchema = new mongoose.Schema({
  lubrication: {
    ring1: String,
    ring2: String,
    ring3: String,
    ring4: String
  },
  surface: {
    ring1: String,
    ring2: String,
    ring3: String,
    ring4: String
  },
  deposit: {
    ring1: String,
    ring2: String,
    ring3: String,
    ring4: String
  },
  breakage: {
    ring1: String,
    ring2: String,
    ring3: String,
    ring4: String
  },
  image: String,
  remark: String
});


// TODO Update only info object
// app.post("/updateInfo", async (req, res) => {
//   console.log(req.body);
//   const result = await userModel.updateOne({ _id: req.body._id }, { $set: { info: req.body } });
//   console.log(result)
//   res.send({ message: "Updated Successfully" })
// });

// app.post("/getReports", async (req, res) => {
//   console.log(req.body);
//   const result = await userModel.findOne({ _id: req.body._id }, (err, dataResult) => {
//     console.log(dataResult);
//     res.send({
//       message: "Reports",
//       data: dataResult.cylinderDetails,
//       success: true,
//     });
//   }
//   );
// });
