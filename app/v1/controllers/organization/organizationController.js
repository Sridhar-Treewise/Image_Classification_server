/* eslint-disable camelcase */

import Report from "../../models/Reports.js";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import Organization from "../../models/Organizations.js";
import { ERROR_MSG } from "../../../config/messages.js";
import { SUBSCRIPTION_MODEL } from "../../../common/constants.js";
import mongoose from "mongoose";
import Subscription from "../../models/Subscriptions.js";
import { stripe } from "../../../utils/stripe.js";
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
    const subscription = req.subscription;
    const findOrg = await Organization.findOne({ manager: userId });
    const findUser = await User.findOne({ _id: userId });
    let count;

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
        if (subscription.plan === SUBSCRIPTION_MODEL.FREE) {
            count = findOrg.FREE_TRIAL_LIMIT.maxVessels - 1;
            await Organization.findOneAndUpdate({ _id: findOrg._id }, { $set: { "FREE_TRIAL_LIMIT.maxVessels": count } }, { new: true });
        }
        if (subscription.plan === SUBSCRIPTION_MODEL.BASIC) {
            count = findOrg.BASIC_LIMIT.maxVessels - 1;
            await Organization.findOneAndUpdate({ _id: findOrg._id }, { $set: { "BASIC_LIMIT.maxVessels": count } }, { new: true });
        }
        if (subscription.plan === SUBSCRIPTION_MODEL.PRO) {
            count = findOrg.PRO_LIMIT.maxVessels - 1;
            await Organization.findOneAndUpdate({ _id: findOrg._id }, { $set: { "PRO_LIMIT.maxVessels": count } }, { new: true });
        }
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
            .select("vesselDetails email approvedStatus inspectionDetails");
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
export const getVesselById = async (req, res) => {
    const vesselId = req.params.id;
    try {
        const vessel = await User.findOne({ _id: vesselId })
            .select("vesselDetails email phone inspectionDetails.cylinder_numbers");
        if (!vessel) return res.status(404).json({ errorTitle: ERROR_MSG.NO_DETAILS, message: "No records found" });
        const reportCount = await Report.find({ vesselId });
        const result = await Report.aggregate([
            {
                $match: { vesselId: mongoose.Types.ObjectId(vesselId) }
            },
            {
                $project: {
                    totalImages: {
                        $size: {
                            $filter: {
                                input: { $objectToArray: "$cylindersReport" },
                                as: "cylinder",
                                cond: { $ne: ["$$cylinder.v.image", ""] }
                            }
                        }
                    }
                }
            }
        ]);
        const report = {
            reportCount: reportCount.length,
            cylinderImageCount: result[0]?.totalImages
        };
        const data = {
            ...vessel.vesselDetails,
            ...vessel.inspectionDetails
        };
        res.status(200).json({ data, report });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const deleteVessel = async (req, res) => {
    const vesselId = req.params.id;
    try {
        const update = await User.deleteOne({ _id: vesselId });
        if (!update) return res.status(404).send({ message: ERROR_MSG.UPDATE_FAILED });
        res.status(200).json({ message: " Vessel Removed Successfully" });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const choosePlan = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user });
        if (!user.subscription) return res.status(404).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: ERROR_MSG.USER_NOT });
        // TODO check whether he has planning
        // if customer already have plan:-> need to discuss of upgrade subscription
        const subs = await Subscription.findOne({ _id: user.subscription._id });
        if (!subs.customerId) return res.status(400).json({ errorTitle: "Error: Unable to process request", message: "Stripe Customer ID not found in the records. Please provide a valid customer ID" });


        // eslint-disable-next-line no-unused-vars
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: req.body.priceId,
                    quantity: 1
                }
            ],
            success_url: process.env.URL_PAYMENT_SUCCESS,
            cancel_url: process.env.URL_PAYMENT_CANCEL,
            customer: subs.customerId
        }, {
            apiKey: process.env.STRIPE_SECRET_KEY
        });
        res.status(200).json({ redirection: true, ...session });
        // TODO  handle subscribed or not
        // if subscribed update corresponding details
        // Add failed and success transaction to our database
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
