import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    company_name: {
        type: String,
        default: "",
        index: true,
        unique: true
    },
    domain: {
        type: String,
        default: "",
        index: true
    },
    code: String,
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});
const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
