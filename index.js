const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
console.log(process.env.USERNAME_MONGODB);

/*==============================================
            Port Details and Database url
================================================*/
const PORT = process.env.PORT || 8080;
const URL = process.env.MONGODB_URL;
console.log(process.env.MONGODB_URL);

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Successfull");
  })
  .catch((err) => {
    console.log(err);
  });

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
  date : Date,
  alert : Boolean,
});


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    trim: true,
  },
  mobile: String,
  password: String,
  confirmPassword: String,
  info: {
    company_name: String,
    vessel_name: String,
    hull_number: String,
    manufacturer_and_type_of_engine: String,
    vessel_type: String,
    inspection_date: String,
    total_running_hours: String,
    running_hrs_since_last: String,
    cyl_oil_Type: String,
    cyl_oil_consump_Ltr_24hr: String,
    normal_service_load_in_percent_MCR: String,
    lubrication_regulation: String,
    cylinder_numbers: String,
  },
  cylinderDetails : [{}]
});
const userModel = new mongoose.model("User", userSchema);

/*===============================================
            Route get and post method
================================================*/
app.get("/", async(req, res) => {
    const userData = await userModel.find({})
  res.send(userData);
});

app.post("/signup", (req, res) => {
  console.log(req.body);
  try{
    userModel.findOne({ email: req.body.email }, async (err, user) => {
      if (user) {
        if (req.body.password === user.password) {
          res.send({ message: "This User is already registered" });
        } else {
          res.send({ message: "Check your Password" });
        }
      } else {
        const user = new userModel({
          email: req.body.email,
          mobile: req.body.mobile,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword,
          info: {
            company_name: req.body.company_name,
            vessel_name: req.body.vessel_name,
            hull_number: req.body.hull_number,
            manufacturer_and_type_of_engine: req.body.manufacturer_and_type_of_engine,
            vessel_type: req.body.vessel_type,
            inspection_date: req.body.inspection_date,
            total_running_hours: req.body.total_running_hours,
            running_hrs_since_last: req.body.running_hrs_since_last,
            cyl_oil_Type: req.body.cyl_oil_Type,
            cyl_oil_consump_Ltr_24hr: req.body.cyl_oil_consump_Ltr_24hr,
            normal_service_load_in_percent_MCR: req.body.normal_service_load_in_percent_MCR,
            lubrication_regulation: req.body.lubrication_regulation,
            cylinder_numbers: req.body.cylinder_numbers,
          },
        });
  
        const registered = await user.save();
        res.send({ message: "Registation Successfull! Login again..." , error : false});
      }
    });
  }
  catch(err){
    res.send({message : err , error : true})
  }
});

app.post("/signin", (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    userModel.findOne({ email: email }, (err, user) => {
      if (user) {
        console.log(password);
        console.log(user.password);
        if (password === user.password) {
          res.send({ message: ` Login successfull`, user });
        } else {
          res.send({ message: "Check your password" });
        }
      } else {
        res.send({ message: `This email id is not Registered` });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/updateData", (req, res) => {
  console.log(req.body);
});

/*===============================================
            listen the port
================================================*/
app.listen(PORT, () => {
  console.log("running"+PORT);
});
