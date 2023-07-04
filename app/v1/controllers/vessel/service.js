/* eslint-disable camelcase */

import _ from "lodash";
import User from "../../models/User.js";
import { ERROR_MSG } from "../../../config/messages.js";

export const updateProfile = async (req, res) => {
    const { email } = req.body;
    const profileDetails = _.cloneDeep(req.body);
    try {
        const result = await User.findOneAndUpdate({ email, ...profileDetails }, { new: true });
        if (!result) return res.status(400).json({ message: ERROR_MSG.PROFILE_NOT });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const savePredictionData = async (req, res) => {
    const { user, predictionInfo } = req.body;
    try {
        const result = await User
            .updateOne({ _id: user._id }, { $push: { cylinderDetails: predictionInfo } });
        if (!result) return res.status(400).json({ message: "Data did not saved" });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};


export const getReports = async (req, res) => {
    const id = req.user;
    try {
        const result = await User.findOne({ _id: id });
        if (!result) return res.status(404).send("Profile not found");
        res.status(200).json(result.cylinderDetails);
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const getCylinderDetails = async (req, res) => {
    const { id } = req.query;
    try {
        const result = await User.findOne({ _id: id });
        if (!result) return res.status(404).send("No details found");
        const { cylinder_numbers = 0, cylinderDetails = [], info } = result;
        res.status(200).json({ cylinderNumbers: cylinder_numbers, cylinderDetails, info });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};


export const getInspectionDetails = async (req, res) => {
    const userId = req.user;
    try {
        const result = await User.findOne({ _id: userId });
        if (!result) return res.status(404).send({ message: ERROR_MSG.NO_DETAILS });
        res.status(200).json({ data: result.inspectionDetails || {} });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
