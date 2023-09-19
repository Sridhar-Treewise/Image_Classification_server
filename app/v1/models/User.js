/* eslint-disable new-cap */
/* eslint-disable indent */
import mongoose from "mongoose";
import { DESIGNATION, USER_TYPE } from "../../common/constants.js";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        index: true,
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        index: true,
        trim: true,
        unique: true
    },
    password: { type: String, unique: true },
    status: { type: Boolean, default: true, require: true },
    approvedStatus: { type: Boolean, default: false, require: true },
    userType: {
        type: String,
        enums: USER_TYPE,
        default: USER_TYPE[0]
    },
    vesselDetails: {
        vessel_name: { type: String, default: "", index: true },
        imo_number: { type: Number, default: 0, unique: true },
        manufacturer: { type: String, default: "" },
        type_of_engine: { type: String, default: "" },
        vessel_type: { type: String, default: "" }
    },
    inspectionDetails: {
        inspection_date: { type: Number, default: 0 },
        normal_service_load_in_percent_MCRMCR: { type: String, default: "" },
        total_running_hours: { type: String, default: "" },
        running_hrs_since_last: { type: String, default: "" },
        cyl_oil_Type: { type: String, default: "" },
        cyl_oil_consump_Ltr_24hr: { type: String, default: "" },
        normal_service_load_in_percent_MCR: { type: String, default: "" },
        cylinder_numbers: { type: Number, default: 0 }
    },
    officerAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    organizationBelongsTo: {
        index: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },
    designation: {
        type: String,
        enum: DESIGNATION,
        default: DESIGNATION[2],
        required: true
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription"
    }
});

const User = new mongoose.model("User", userSchema);

export default User;

