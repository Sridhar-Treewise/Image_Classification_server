/* eslint-disable camelcase */

import _ from "lodash";
import User from "../../models/User.js";
import { ERROR_MSG } from "../../../config/messages.js";
import { DEFECT_DETECTION, HTTP_HEADER } from "../../../common/constants.js";
import axios from "axios";

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
        res.status(200).json({ cylinder_numberss: cylinder_numbers, cylinderDetails, info });
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


export const generatePredictedImage = async (req, res) => {
    const userId = req.user;
    console.log("req", req.body)
    const { image, cylinder, ...updatedData } = req.body;
    if (!image) return res.status(400).send({ message: ERROR_MSG.PAYLOAD_INVALID });
    const predicatedImagePromise = axios.post(DEFECT_DETECTION.PREDICT_IMAGE, image, HTTP_HEADER);
    try {
        const result = await User.findOneAndUpdate({ _id: userId }, { $set: { inspectionDetails: updatedData } }, { new: true });
        if (!result) return res.status(404).send({ message: ERROR_MSG.UPDATE_FAILED });
        predicatedImagePromise.then(response => {
            const results = response.data;
            res.status(201).json({ data: { predictionDetails: { ...results, cylinder }, updatedResult: result.inspectionDetails } });
        });
        predicatedImagePromise.catch(error => {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data.message;
                res.status(status).json({
                    errorTitle: ERROR_MSG.SOMETHING_WENT,
                    message
                });
            } else {
                res.status(500).json({
                    errorTitle: ERROR_MSG.SOMETHING_WENT,
                    message: error.message
                });
            }
        });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const updateInspectionDetails = async (req, res) => {
    const userId = req.user;
    try {
        const result = await User.findOneAndUpdate({ _id: userId }, { $set: { inspectionDetails: req.body } }, { new: true });
        if (!result) return res.status(404).send({ message: ERROR_MSG.UPDATE_FAILED });
        res.status(201).json({ data: result.inspectionDetails || {} });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
