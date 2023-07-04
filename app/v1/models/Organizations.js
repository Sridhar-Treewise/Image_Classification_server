import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    domain: {
        type: String
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
