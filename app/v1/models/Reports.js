import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    inspectionDetails: {
        inspectionDate: { type: Number, default: "" },
        serviceLoadMCR: { type: String, default: "" },
        totalRunningHours: { type: String, default: "" },
        lastRunningHours: { type: String, default: "" },
        cylinderOilType: { type: String, default: "" },
        cylinderOilConsump: { type: String, default: "" },
        serviceLoad: { type: String, default: "" },
        cylinderNumber: { type: String, default: "" }
    }

});
const User = mongoose.model("Reports", Schema);

export default User;

