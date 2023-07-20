import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    vesselId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    inspection_date: { type: Number, default: 0, index: true },
    normal_service_load_in_percent_MCRMCR: { type: String, default: "" },
    total_running_hours: { type: String, default: "" },
    running_hrs_since_last: { type: String, default: "" },
    cyl_oil_Type: { type: String, default: "" },
    cyl_oil_consump_Ltr_24hr: { type: String, default: "" },
    normal_service_load_in_percent_MCR: { type: String, default: "" },
    cylinder_numbers: { type: Number }
    // ...other data

});
const Report = mongoose.model("Reports", Schema);

export default Report;

