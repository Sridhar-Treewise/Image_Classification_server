/* eslint-disable new-cap */
/* eslint-disable indent */
import mongoose from "mongoose";
import { DESIGNATION, SUBSCRIPTION_MODEL, USER_TYPE } from "../../common/constants.js";
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
    phone: String,
    password: { type: String, unique: true },
    status: { type: Boolean, default: true, require: true },
    userType: {
        type: String,
        enums: USER_TYPE,
        default: USER_TYPE[0]
    },
    vesselDetails: {
        vessel_name: { type: String, default: "", index: true },
        imo_number: { type: Number, default: "" },
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
        cylinder_numbers: { type: Number, default: "" }
    },
    officerAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    organizationBelongsTo: {
        index: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organizations"
    },
    designation: {
        type: String,
        enum: DESIGNATION,
        default: DESIGNATION[2],
        required: true
    },
    subscription: {
        plan: { type: String, default: SUBSCRIPTION_MODEL.BASIC, required: true },
        startDate: { type: Date },
        endDate: { type: Date },
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
});
const User = new mongoose.model("User", userSchema);

export default User;