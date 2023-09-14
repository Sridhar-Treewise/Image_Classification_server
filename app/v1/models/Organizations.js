
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
    }],
    freePlanLimit: {
        maxManagers: {
            type: Number,
            default: 1
        },
        maxVessels: {
            type: Number,
            default: 1
        },
        maxDownloads: {
            type: Number,
            default: 0
        },
        pastViewDuration: {
            type: Number,
            default: 30
        }
    },
    basicPlanLimit: {
        maxManagers: {
            type: Number,
            default: 3
        },
        maxVessels: {
            type: Number,
            default: 3
        },
        maxDownloads: {
            type: Number,
            default: 10
        },
        pastViewDuration: {
            type: Number,
            default: 30
        }
    },
    proPlanLimit: {
        maxManagers: {
            type: Number,
            default: 7
        },
        maxVessels: {
            type: Number,
            default: 5
        },
        maxDownloads: {
            type: Number,
            default: Number.MAX_SAFE_INTEGER
        },
        pastViewDuration: {
            type: Number,
            default: 2
        }
    }
});
const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
