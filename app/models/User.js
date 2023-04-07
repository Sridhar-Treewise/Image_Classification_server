/* eslint-disable new-cap */
/* eslint-disable indent */
import mongoose from "mongoose";
import { SUBSCRIPTION_MODEL } from "../common/constants.js";
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        index: true,
        unique: true,
        trim: true
    },
    password: { type: String, unique: true },
    status: { type: Boolean, default: true, require: true },
    subscription: {
        plan: { type: String, default: SUBSCRIPTION_MODEL.BASIC, required: true },
        startDate: { type: Date },
        endDate: { type: Date },
        amountPaid: { type: Number },
        transactionId: { type: String }
    },
    userType: { type: String },
    mobile: String,
    info: {
        company_name: String,
        vessel_name: String,
        imo_number: String,
        manufacturer: String,
        type_of_engine: String,
        vessel_type: String,
        inspection_date: String,
        total_running_hours: String,
        running_hrs_since_last: String,
        cyl_oil_Type: String,
        cyl_oil_consump_Ltr_24hr: String,
        normal_service_load_in_percent_MCR: String,
        cylinder_numbers: String
    },
    cylinderDetails: [Object]
});
const User = new mongoose.model("User", userSchema);

export default User;
