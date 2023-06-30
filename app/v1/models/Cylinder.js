/* eslint-disable new-cap */
/* eslint-disable indent */
import mongoose from "mongoose";

const cylinderSchema = new mongoose.Schema({
    user: {
    },

});
const User = new mongoose.model("Cylinder", cylinderSchema);

export default User;
