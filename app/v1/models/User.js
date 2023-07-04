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
        unique: true,
        trim: true
    },
    phone: String,
    password: { type: String, unique: true },
    status: { type: Boolean, default: true, require: true },
    userType: {
        type: String,
        enums: USER_TYPE,
        default: USER_TYPE[0]
    },
    vesselName: {
        type: String,
        default: "",
        index: true,
        unique: true
    },
    vesselDetails: {
        imoNumber: { type: Number, default: "" },
        manufacturer: { type: String, default: "" },
        engineType: { type: String, default: "" },
        vesselType: { type: String, default: "" }
    },
    inspectionDetails: {
        inspectionDate: { type: Date, default: "" },
        serviceLoadMCR: { type: String, default: "" },
        totalRunningHours: { type: String, default: "" },
        lastRunningHours: { type: String, default: "" },
        cylinderOilType: { type: String, default: "" },
        cylinderOilConsump: { type: String, default: "" },
        serviceLoad: { type: String, default: "" },
        cylinderNumber: { type: String, default: "" }
    },
    organizationBelongsTo: {
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
