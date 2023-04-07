/* eslint-disable indent */
import mongoose from "mongoose";

const authSchema = mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String, unique: true },
    status: { type: Boolean, default: true, require: true }
});


const Auth = mongoose.model("Auth", authSchema);

export default Auth;
