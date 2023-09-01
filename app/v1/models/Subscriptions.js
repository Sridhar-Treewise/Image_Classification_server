import mongoose from "mongoose";
import { SUBSCRIPTION_MODEL } from "../../common/constants.js";

const subscriptionSchema = new mongoose.Schema({
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orgCode: {
        type: String,
        required: true
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },
    plan: {
        type: String, default: SUBSCRIPTION_MODEL.FREE, required: true
    },
    startDate: { type: Date },
    endDate: { type: Date },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    }
});

const Transaction = mongoose.model("Subscription", subscriptionSchema);

export default Transaction;
