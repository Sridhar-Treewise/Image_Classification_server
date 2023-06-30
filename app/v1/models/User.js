/* eslint-disable new-cap */
/* eslint-disable indent */
import mongoose from "mongoose";
import { DESIGNATION, SUBSCRIPTION_MODEL, USER_TYPE } from "../../common/constants.js";
const userSchema = new mongoose.Schema({
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
    mobile: String,
    vesselDetails: {
        vesselName: String,
        imoNumber: Number,
        manufacturer: String,
        engineType: String,
        vesselType: String
    },
    inspectionDetails: {
        inspectionDate: Number,
        serviceLoadMCR: String,
        totalRunningHours: String,
        lastRunningHours: String,
        cylinderOilType: String,
        cylinderOilConsump: String,
        serviceLoad: String,
        cylinderNumber: String
    },
    organizationBelongsTo: {
        type: String,
        default: "",
        required: true
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
