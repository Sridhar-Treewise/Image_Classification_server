import express from "express";
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "morgan"
import createError from 'http-errors';
import authRoutes from "./app/routes/auth/authRoutes.js";
import serviceRoutes from "./app/routes/service.js";

dotenv.config()
const app = express();

const PORT = process.env.PORT || 8080;
const URL = process.env.MONGODB_URL;


app.use(cors());
app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*===============================================
           API for Auth and Services
================================================*/
app.use("/api/auth", authRoutes)
app.use("/api/service", serviceRoutes)


app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message });
});

mongoose
  .connect(URL)
  .then(() => {
    console.log("DB Connected");
    app.listen(PORT, () => {
      const environment = process.env.NODE_ENV;
      console.log(`Server is running in ${environment} mode at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error connecting database \n ${err.message}`);
  });

//not use
const cylinderSchema = new mongoose.Schema({
  lubrication: {
    ring1: String,
    ring2: String,
    ring3: String,
    ring4: String,
  },
  surface: {
    ring1: String,
    ring2: String,
    ring3: String,
    ring4: String,
  },
  deposit: {
    ring1: String,
    ring2: String,
    ring3: String,
    ring4: String,
  },
  breakage: {
    ring1: String,
    ring2: String,
    ring3: String,
    ring4: String,
  },
  image: String,
  remark: String,
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
