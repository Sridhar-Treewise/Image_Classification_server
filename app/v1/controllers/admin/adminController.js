
import User from "../../models/User.js";
import Transaction from "../../models/Transactions.js";
import Report from "../../models/Reports.js";
import { ERROR_MSG } from "../../../config/messages.js";
import Organization from "../../models/Organizations.js";
import Subscription from "../../models/Subscriptions.js";
import { SUBSCRIPTION_MODEL, SUBSCRIPTION_AMOUNT } from "../../../common/constants.js";
import { stripe } from "../../../utils/stripe.js";

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
// TODO ->Params Validation
export const getTransactionCount = async (req, res) => {
    try {
        const numberOfDays = req.query.days || 30;
        const days = parseInt(numberOfDays);
        if (isNaN(days)) {
            return res.status(422).json({ message: ERROR_MSG.INVALID_INPUT });
        }
        const currentTimestamp = Date.now();
        const nDaysAgoTimestamp = currentTimestamp - days * 24 * 60 * 60 * 1000;

        const totalRevenueLastNDays = await Transaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: nDaysAgoTimestamp, $lte: currentTimestamp },
                    status: "success"
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const totalRevenueNDaysAgo = await Transaction.aggregate([
            {
                $match: {
                    createdAt: { $lt: nDaysAgoTimestamp },
                    status: "success"
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        const totalRevenueLastNDaysValue = totalRevenueLastNDays.length > 0 ? totalRevenueLastNDays[0].total : 0;
        const totalRevenueNDaysAgoValue = totalRevenueNDaysAgo.length > 0 ? totalRevenueNDaysAgo[0].total : 0;
        const increase = totalRevenueLastNDaysValue - totalRevenueNDaysAgoValue;
        const percentageIncrease = (totalRevenueNDaysAgoValue !== 0 ? (Math.abs(increase) / totalRevenueNDaysAgoValue) * 100 : 0).toFixed(1);
        let data = {};
        if (totalRevenueLastNDaysValue === 0) {
            data = {
                value: totalRevenueLastNDaysValue,
                percentage: 0
            };
        } else {
            data = {
                value: totalRevenueLastNDaysValue,
                percentage: percentageIncrease
            };
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const addPrice = async (req, res) => {
    const { productId, interval, plan } = req.body;
    try {
        let amount;
        if (plan.toUpperCase() === SUBSCRIPTION_MODEL.BASIC) {
            amount = SUBSCRIPTION_AMOUNT.BASIC;
        }
        if (plan.toUpperCase() === SUBSCRIPTION_MODEL.PRO) {
            amount = SUBSCRIPTION_AMOUNT.PRO;
        }
        if (plan.toUpperCase() === SUBSCRIPTION_MODEL.CUSTOM) {
            amount = SUBSCRIPTION_AMOUNT.CUSTOM;
        }
        const price = await stripe.prices.create({
            unit_amount: amount,
            currency: "usd",
            recurring: { interval },
            product: productId
        });
        res.status(200).json(price);
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};


