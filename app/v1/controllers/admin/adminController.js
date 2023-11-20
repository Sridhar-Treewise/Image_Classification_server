
import User from "../../models/User.js";
import Report from "../../models/Reports.js";
import { ERROR_MSG } from "../../../config/messages.js";
import Organization from "../../models/Organizations.js";
import Subscription from "../../models/Subscriptions.js";
import { SUBSCRIPTION_MODEL } from "../../../common/constants.js";

export const dashboardSubscription = async (req, res) => {
    try {
        const organizations = await Organization.countDocuments();
        const freeTrail = await Subscription.distinct("orgCode", { plan: SUBSCRIPTION_MODEL.FREE });
        const basic = await Subscription.distinct("orgCode", { plan: SUBSCRIPTION_MODEL.BASIC });
        const pro = await Subscription.distinct("orgCode", { plan: SUBSCRIPTION_MODEL.PRO });
        const premium = await Subscription.distinct("orgCode", { plan: SUBSCRIPTION_MODEL.CUSTOM });
        const series = [freeTrail.length, basic.length, pro.length, premium.length];
        const labels = Object.values(SUBSCRIPTION_MODEL);
        const dataList = {
            series,
            labels
        };

        const data = {
            organizations,
            dataList
        };
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const dashboardUsersList = async (req, res) => {
    try {
        const condClause = {
            userType: "Organization",
            designation: "FLEET_MANAGER"
        };
        const totalUsers = await User.countDocuments({ userType: { $ne: "Admin" } });
        const vessels = await User.countDocuments({ userType: "Vessel" });
        const fleetManagers = await User.countDocuments(condClause);
        const series = [vessels, fleetManagers];
        const labels = ["Fleet Managers", "Vessels"];
        const dataList = {
            series,
            labels
        };
        const data = {
            totalUsers,
            dataList
        };
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const dashboardReportImageCount = async (req, res) => {
    try {
        const reports = await Report.countDocuments();
        const cylinderImageCount = await Report.aggregate([
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
            },
            {
                $group: {
                    _id: null,
                    totalImages: { $sum: "$totalImages" }
                }
            }
        ]);
        const data = {
            reports,
            cylinderImageCount: cylinderImageCount[0].totalImages
        };
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const getSubscriptionCount = async (req, res) => {
    try {
        const freeTrail = await Subscription.distinct("orgCode", { plan: SUBSCRIPTION_MODEL.FREE });
        const basic = await Subscription.distinct("orgCode", { plan: SUBSCRIPTION_MODEL.BASIC });
        const pro = await Subscription.distinct("orgCode", { plan: SUBSCRIPTION_MODEL.PRO });
        const premium = await Subscription.distinct("orgCode", { plan: SUBSCRIPTION_MODEL.PREMIUM });

        const data = {
            freeTrail: freeTrail.length,
            basic: basic.length,
            pro: pro.length,
            premium: premium.length
        };
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const getTransactionCount = async (req, res) => {
    try {
        const totalRevenue = 0;
        const totalTransaction = 0;

        const data = {
            totalRevenue,
            totalTransaction
        };
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

