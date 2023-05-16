
import _ from "lodash";
import { ERROR_MSG } from "../../../common/constants.js";
import User from "../../models/User.js";

export const updateProfile = async (req, res) => {
    const { email } = req.body;
    const profileDetails = _.cloneDeep(req.body);
    try {
        const result = await User.findOneAndUpdate({ email: email, ...profileDetails }, { new: true });
        if (!result) return res.status(400).send("Profile not updated");
        res.status(201).json(result)
    } catch (error) {
        console.log("error", error)
        res.status(500).send(`${ERROR_MSG.SOMETHING_WENT} \n ${error.message}`)

    }
}

export const savePredictionData = async (req, res) => {
    const { user, predictionInfo } = req.body;
    try {
        const result = await userModel
            .updateOne({ _id: user._id }, { $push: { cylinderDetails: predictionInfo } });
        if (!result) return res.status(400).send("Data did not saved");
        res.status(201).json(result)

    } catch (error) {
        res.status(500).send(`${ERROR_MSG.SOMETHING_WENT} \n ${error.message}`)

    }
}

export const getProfileDetails = async (req, res) => {
    const id = req.user;
    try {
        const result = await User.findOne({ userId: id });
        const profileDetail = _.cloneDeep(result)
        if (!result) return res.status(404).send("Profile not found");
        res.status(200).json(profileDetail);

    } catch (error) {
        console.log("error", error)
        res.status(500).send(`${ERROR_MSG.SOMETHING_WENT} \n ${error.message}`)

    }
}


export const getReports = async (req, res) => {
    const id = req.user;
    try {
        const result = await User.findOne({ _id: id });
        if (!result) return res.status(404).send("Profile not found");
        res.status(200).json(result.cylinderDetails);

    } catch (error) {
        console.log("error", error)
        res.status(500).send(`${ERROR_MSG.SOMETHING_WENT} \n ${error.message}`)
    }
}

export const getCylinderDetails = async (req, res) => {
    const { id } = req.query
    try {
        const result = await userModel.findOne({ _id: id });
        if (!result) return res.status(404).send("No details found");
        const { cylinder_numbers = 0, cylinderDetails = [], info } = result;
        res.status(200).json({ cylinderNumbers: cylinder_numbers, cylinderDetails, info: info })
    } catch (error) {
        console.log("error", error)
        res.status(500).send(`${ERROR_MSG.SOMETHING_WENT} \n ${error.message}`)
    }
}