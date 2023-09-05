
import User from "../../models/User.js";
import Report from "../../models/Reports.js";
import { ERROR_MSG } from "../../../config/messages.js";
import Organization from "../../models/Organizations.js";
import Subscription from "../../models/Subscriptions.js";
import { SUBSCRIPTION_MODEL } from "../../../common/constants.js";

export const dashboardList = async (req, res) => {
    try {
        const condClause = {
            userType: "Organization",
            designation: "FLEET_MANAGER"
        };
        const organizations = await Organization.countDocuments();
        const totalUsers = await User.countDocuments({ userType: { $ne: "Admin" } });
        const vessels = await User.countDocuments({ userType: "Vessel" });
        const fleetManagers = await User.countDocuments(condClause);
        const data = {
            organizations,
            totalUsers,
            vessels,
            fleetManagers
        };
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const dashboardReportImageCount = async (req, res) => {
    try {
        const reports = await Report.countDocuments();
        const cylinderImageCount = 0; // TODO
        const data = {
            reports,
            cylinderImageCount
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

