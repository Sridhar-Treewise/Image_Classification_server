import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    inspectionDetails: {
        inspection_date: { type: Number, default: "" },
        normal_service_load_in_percent_MCRMCR: { type: String, default: "" },
        total_running_hours: { type: String, default: "" },
        running_hrs_since_last: { type: String, default: "" },
        cyl_oil_Type: { type: String, default: "" },
        cyl_oil_consump_Ltr_24hr: { type: String, default: "" },
        normal_service_load_in_percent_MCR: { type: String, default: "" },
        cylinder_numbers: { type: String, default: "" }
    }

});
const User = mongoose.model("Reports", Schema);

export default User;

