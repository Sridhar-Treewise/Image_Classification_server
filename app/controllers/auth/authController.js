import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Auth from "../../models/Auth.js";
import User from "../../models/User.js";
import _ from "lodash"
import { ERROR_MSG } from "../../common/constants.js";

// async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       userModel.findOne({ email: email }, (err, user) => {
//         if (user) {
//           if (password === user.password) {
//             res.json({ message: `Login successfull`, user: user, success: true });
//           } else {
//             res.json({ message: "Check your password", success: false });
//           }
//         } else {
//           res.json({ message: `This email id is not Registered`, success: false });
//         }
//       });

//     } catch (err) {
//       res.json({ message: err, success: false });
//     }
//   }
export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) return res.status(404).send("Invalid Credential");
        const id = user._id.toString();
        const isPassword = await bcrypt.compare(password, user.password)
        if (!isPassword) return res.status(403).send("Invalid credentials")
        const token = jwt.sign({ userId: id, email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(200).json({ token })
    } catch (error) {
        console.log("error", error)
        res.status(500).send(`${ERROR_MSG.SOMETHING_WENT} \n ${error.message}`)

    }
}

export const signUp = async (req, res) => {
    console.log("1")
    const { email, password } = req.body;
    console.log({ req: req.body })
    const credentials = _.cloneDeep(req.body)
    const profileDetails = _.omit(credentials, ['password']);
    try {
        const isExists = await User.findOne({ email: email });
        if (isExists) return res.status(409).send("User already exists, please try different email");
        console.log("2")
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("3")
        const result = await Auth.create({ ...profileDetails, password: hashedPassword });
        console.log("4")
        if (!result) return res.status(400).send("User Profile Not created")
        const token = jwt.sign({ userId: result._id, email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(201).json(token)
    } catch (error) {
        console.log("error", error)
        res.status(500).send(`${ERROR_MSG.SOMETHING_WENT} \n ${error.message}`)
    }
}

// (req, res) => {
//     console.log(req.body);
//     try {
//         userModel.findOne({ email: req.body.email },
//             async (err, user) => {
//                 if (user) {
//                     if (req.body.password === user.password) {
//                         res.send({ message: "This User is already registered", error: false, });
//                     } else {
//                         res.send({ message: "Check your Password", error: false, });
//                     }
//                 } else {
//                     const user = new userModel({
//                         email: req.body.email,
//                         mobile: req.body.mobile,
//                         password: req.body.password,
//                         confirmPassword: req.body.confirmPassword,
//                         info: {
//                             company_name: req.body.company_name,
//                             vessel_name: req.body.vessel_name,
//                             imo_number: req.body.imo_number,
//                             manufacturer: req.body.manufacturer,
//                             type_of_engine: req.body.type_of_engine,
//                             vessel_type: req.body.vessel_type,
//                             inspection_date: req.body.inspection_date,
//                             total_running_hours: req.body.total_running_hours,
//                             running_hrs_since_last: req.body.running_hrs_since_last,
//                             cyl_oil_Type: req.body.cyl_oil_Type,
//                             cyl_oil_consump_Ltr_24hr: req.body.cyl_oil_consump_Ltr_24hr,
//                             normal_service_load_in_percent_MCR:
//                                 req.body.normal_service_load_in_percent_MCR,
//                             cylinder_numbers: req.body.cylinder_numbers,
//                         },
//                     });

//                     const registered = await user.save();
//                     res.json({
//                         message: "Registation Successfull! Login again...",
//                         error: false,
//                     });
//                 }
//             }
//         );
//     } catch (err) {
//         res.json({ message: err, error: true });
//     }
// }