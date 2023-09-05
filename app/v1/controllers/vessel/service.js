/* eslint-disable quotes */
/* eslint-disable camelcase */

import _ from "lodash";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { ERROR_MSG } from "../../../config/messages.js";
import { DEFECT_DETECTION, HTTP_HEADER, DOC_TYPE, HTTP_HEADER_IMG } from "../../../common/constants.js";
import axios from "axios";
import { handleFailedOperation } from "../../../utils/apiOperation.js";
import Report from "../../models/Reports.js";

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
    const userId = req.user;
    const { predictionInfo, cylindersReport, organization } = req.body;
    const data = { vesselId: userId, predictionInfo, cylindersReport, organization };

    try {
        // TODO
        // validation for duplicate prevention [+]
        // const existingRecord = await Report.findOne({ userId });
        // if (existingRecord) return res.status(409).json({ message: "Vessel id already exists" });
        const result = await Report.create(data);
        if (!result) return res.status(400).json({ message: ERROR_MSG.FAILED_SAVE("result not found") });
        res.status(204).json({});
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};


export const getReports = async (req, res) => {
    const id = req.user;
    const { startDate, endDate } = req.query;
    try {
        const filter = {};
        filter.vesselId = id;
        if (startDate && endDate) {
            filter.inspection_date = {
                $gte: startDate,
                $lte: endDate
            };
        }
        const { pageSize, pageIndex } = req.query;
        const parsedPageSize = parseInt(pageSize);
        const parsedPageIndex = parseInt(pageIndex);
        const skip = parsedPageIndex * parsedPageSize;
        const limit = parsedPageSize;

        const data = await Report.find(filter).skip(skip).limit(limit).select("-predictionInfo");
        const ReportDataCount = await Report.count(filter);


        res.status(200).send({
            data,
            pagingInfo: {
                totalCount: ReportDataCount,
                pageIndex: parsedPageIndex,
                pageSize: parsedPageSize
            }
        });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const getReportById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Report.findOne({ _id: id }).select({ _id: 0, vesselId: 0, organization: 0 });
        if (!data) return res.status(404).json({ errorTitle: ERROR_MSG.NO_DETAILS, message: "No records found" });
        res.status(200).send({ data });
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


export const generatePredictedImage = (req, res) => {
    const userId = req.user;
    const { image, cylinder, ...updatedData } = req.body;

    if (!image) {
        return res.status(400).send({ message: ERROR_MSG.PAYLOAD_INVALID });
    }

    const predicatedImagePromise = axios.post(DEFECT_DETECTION.PREDICT_IMAGE, { image }, HTTP_HEADER_IMG);

    predicatedImagePromise
        .then(async response => {
            const results = response.data;
            const result = await User.findOneAndUpdate({ _id: userId }, { $set: { inspectionDetails: updatedData } }, { new: true });

            if (!result) {
                return res.status(404).send({ message: ERROR_MSG.UPDATE_FAILED });
            }
            res.status(201).json({ data: { predictionDetails: { results, cylinder }, updatedResult: result.inspectionDetails } });
        })
        .catch(error => {
            if (error.response) {
                const message = error.response.data.message;
                res.status(200).json(handleFailedOperation(message, ERROR_MSG.SOMETHING_WENT));
            } else if (error.request) {
                res.status(503).json(handleFailedOperation(error.message, ERROR_MSG.SERVICE_NOT_AVAILABLE));
            } else {
                res.status(500).json(handleFailedOperation(error.message, ERROR_MSG.SOMETHING_WENT));
            }
        });
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


export const getVesselInfo = async (req, res) => {
    const userId = req.user;
    try {
        const result = await User.findOne({ _id: userId });
        if (!result) return res.status(404).send({ message: ERROR_MSG.TRY_AGAIN });
        const data = { ...result.vesselDetails, cylinder_numbers: result.inspectionDetails.cylinder_numbers };
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const updateVesselInfo = async (req, res) => {
    const userId = req.user;
    try {
        const updateData = {
            vesselDetails: req.body,
            "inspectionDetails.cylinder_numbers": req.body.cylinder_numbers
        };
        const result = await User.findOneAndUpdate({ _id: userId }, { $set: updateData }, { new: true });
        if (!result) return res.status(404).send({ message: ERROR_MSG.UPDATE_FAILED });
        const data = {
            ...result.vesselDetails,
            cylinder_numbers: result.inspectionDetails.cylinder_numbers
        };
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};


export const exportDocuments = async (req, res) => {
    const { documentType = "" } = req.query;
    let URL = "";
    if (documentType === DOC_TYPE.EXCEL) {
        URL = DEFECT_DETECTION.EXPORT_EXCEL;
    } else if (documentType === DOC_TYPE.PDF) {
        URL = DEFECT_DETECTION.EXPORT_EXCEL;
    }
    const exportDocApi = axios.post(URL, req.body, HTTP_HEADER.headers);
    exportDocApi.then(response => {
        // const contentType = documentType === DOC_TYPE.EXCEL ? 'application/vnd.ms-excel' : 'application/pdf';
        // res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(response.data);
    }).catch(error => {
        if (error.response) {
            const message = error.response.data.message;
            res.status(200).json(handleFailedOperation(message, ERROR_MSG.SOMETHING_WENT));
        } else if (error.request) {
            res.status(503).json({ message: ERROR_MSG.SERVICE_NOT_AVAILABLE });
        } else {
            res.status(500).json({ message: ERROR_MSG.SOMETHING_WENT });
        }
    });
};


export const changePassword = async (req, res) => {
    const { oldPassword, password, confirmPassword } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const findUser = await User.findOne({ _id: req.query.id });
        const isPassword = await bcrypt.compare(oldPassword, findUser.password);
        if (!isPassword) return res.status(400).send({ message: ERROR_MSG.INCORRECT_PSW });
        if (password !== confirmPassword) return res.status(400).send({ message: ERROR_MSG.PASSWORD_MISMATCH });
        const update = await User.findOneAndUpdate({ _id: req.query.id }, { $set: { password: hashedPassword } }, { new: true });
        if (!update) return res.status(404).send({ message: ERROR_MSG.UPDATE_FAILED });
        res.status(201).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
