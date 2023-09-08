/* eslint-disable camelcase */

import Report from "../../models/Reports.js";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import Organization from "../../models/Organizations.js";
import { ERROR_MSG } from "../../../config/messages.js";
export const vesselList = async (req, res) => {
    const id = req.user;
    try {
        const result = await User.find({ officerAdmin: id });
        const vesselDataPromises = result.map(async (user) => {
            const vesselId = user._id;
            const vesselName = user.vesselDetails.vessel_name;
            const profileName = user.fullName;

            const countReports = await Report.aggregate([
                { $match: { vesselId } },
                { $group: { _id: null, totalCount: { $sum: 1 }, latestInspectionDate: { $max: "$inspection_date" } } },
                { $project: { _id: 0, totalCount: 1, latestInspectionDate: 1 } }
            ]);

            return {
                profileName,
                vesselName,
                inspectionCount: countReports.length > 0 ? countReports[0].totalCount : 0,
                latestInspectionDate: countReports.length > 0 ? countReports[0].latestInspectionDate : null
            };
        });

        const vesselData = await Promise.all(vesselDataPromises);

        res.status(200).json({ data: vesselData });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const pendingVesselList = async (req, res) => {
    const id = req.user;
    try {
        const result = await User.find({ approvedStatus: false, officerAdmin: id })
            .select("vesselDetails.vessel_name email vesselDetails.imo_number");
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const approveRequest = async (req, res) => {
    const id = req.params.id;
    try {
        const updateStatus = await User.findOneAndUpdate({ _id: id }, { $set: { approvedStatus: true } }, { new: true });
        if (updateStatus.approvedStatus === false) return res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: "Updation failed" });
        res.status(200).json({ message: "Status updated successfully" });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const createVessel = async (req, res) => {
    const { vessel_name, email, password, fullName, phone, manufacturer, type_of_engine, vessel_type, cylinder_numbers, imo_number } = req.body;
    const userId = req.user;
    const findOrg = await Organization.findOne({ manager: userId });
    const findUser = await User.findOne({ _id: userId });

    try {
        const vesselExists = await User.exists({
            $or: [
                { email },
                { "vesselDetails.vessel_name": vessel_name }
            ]
        });
        const hashedPassword = await bcrypt.hash(password, 10);
        const vesselDetails = { vessel_name, manufacturer, type_of_engine, vessel_type, imo_number };
        const inspectionDetails = { cylinder_numbers };
        if (vesselExists) return res.status(409).json({ errorTitle: ERROR_MSG.EMAIL_VESSEL_EXISTS });
        const vessel = await User.create({ email, password: hashedPassword, fullName, phone, vesselDetails, inspectionDetails, officerAdmin: userId, organizationBelongsTo: findOrg._id, subscription: findUser.subscription, approvedStatus: true });
        if (!vessel) return res.status(400).json({ errorTitle: ERROR_MSG.VESSEL_NOT });
        res.status(201).json({ message: "Vessel created successfully" });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const orgVesselList = async (req, res) => {
    const userId = req.user;
    const { pageSize, pageIndex, vessel_name, imo_number } = req.query;
    const parsedPageSize = parseInt(pageSize);
    const parsedPageIndex = parseInt(pageIndex);
    const skip = parsedPageIndex * parsedPageSize;
    const limit = parsedPageSize;
    const filterConditions = {};
    const baseQuery = { userType: "Vessel", officerAdmin: userId };

    if (vessel_name) {
        filterConditions["vesselDetails.vessel_name"] = vessel_name;
    }

    if (imo_number) {
        filterConditions["vesselDetails.imo_number"] = imo_number;
    }

    const queryConditions = { ...baseQuery, ...filterConditions };
    try {
        const users = await User.find(queryConditions)
            .skip(skip)
            .limit(limit)
            .select("vesselDetails email approvedStatus");
        const totalCount = await User.countDocuments(baseQuery);


        const paginationResult = {
            data: users,
            pageInfo: {
                pageSize: parsedPageSize,
                pageIndex: parsedPageIndex,
                totalCount
            }
        };
        res.status(200).json(paginationResult);
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
