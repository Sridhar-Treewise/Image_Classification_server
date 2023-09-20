/* eslint-disable indent */
import jwt from "jsonwebtoken";
import User from "../v1/models/User.js";
import Subscription from "../v1/models/Subscriptions.js";
import Organization from "../v1/models/Organizations.js";
// import { ERROR_MSG } from "../config/messages.js";
import { ERROR_CODE, SUBSCRIPTION_MODEL, USER_TYPE } from "../common/constants.js";
import { ERROR_MSG } from "../config/messages.js";
import { handleFailedOperation } from "./apiOperation.js";

const config = process.env;
// TODO :- Add -> check blocked no blocked users
export const verifyToken = async (req, res, next) => {
    try {
        let token = req.query.token || req.headers.authorization;
        if (!token) return res.status(401).json({ message: "Token Required for accessing this resource", errorCode: ERROR_CODE.TOKEN_REQUIRED });
        if (!token.length) return res.status(403).json({ message: "Invalid token", errorCode: ERROR_CODE.INVALID_TOKEN });
        token = token.split(" ")[1];
        const decodedToken = jwt.verify(token, config.JWT_SECRET);
        if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
            return res
                .status(401)
                .json({ message: "Token has expired", errorCode: ERROR_CODE.JWT_TOKEN_EXPIRED });
        }
        const { userId = "", userType = "" } = decodedToken;
        const user = await User.findOne({ _id: userId }).populate("subscription");
        if (!user) return res.status(404).json({ message: ERROR_MSG.USER_NOT });
        if (!user.status) return res.status(401).json({ message: "User blocked from accessing resources" });
        req.user = userId;
        req.userType = userType;
        req.subscription = user.subscription;
        if (req.userType !== USER_TYPE[2]) {
            const currentDate = new Date();
            if (req.subscription.endDate < currentDate) {
                await Subscription.findOneAndUpdate({ _id: req.subscription._id }, { $set: { plan: SUBSCRIPTION_MODEL.FREE } });
                return res.status(200).json(handleFailedOperation(ERROR_MSG.SUBSCRIPTION_EXPIRED));
            }
        }

        next();
    } catch (error) {
        res.status(401).json({ errorCode: ERROR_CODE.JWT_TOKEN_EXPIRED, message: error.message });
    }
};
export const verifyUserType = (userType = "") => {
    return async (req, res, next) => {
        try {
            if (userType === req.userType) {
                next();
            } else {
                res.status(403).json({ errorTitle: "Access Denied", message: ERROR_MSG.FORBIDDEN });
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error.message);
        }
    };
};
export const checkSubscriptionValidity = async (req, res, next) => {
    try {
        const userId = req.user;
        const subscription = req.subscription;
        const isManagerLimit = await Organization.findOne({ manager: userId });
        if (subscription.plan === SUBSCRIPTION_MODEL.FREE) {
            if (isManagerLimit.FREE_TRIAL_LIMIT.maxManagers === 0) {
                return res.status(403).json(handleFailedOperation(ERROR_MSG.SUBSCRIPTION_LIMIT_EXCEEDED));
            }
            if (isManagerLimit.FREE_TRIAL_LIMIT.maxVessels === 0) {
                return res.status(403).json(handleFailedOperation(ERROR_MSG.SUBSCRIPTION_LIMIT_EXCEEDED));
            }
        }
        if (subscription.plan === SUBSCRIPTION_MODEL.BASIC) {
            if (isManagerLimit.BASIC_LIMIT.maxManagers === 0) {
                return res.status(200).json(handleFailedOperation(ERROR_MSG.SUBSCRIPTION_LIMIT_EXCEEDED));
            }
            if (isManagerLimit.BASIC_LIMIT.maxVessels === 0) {
                return res.status(403).json(handleFailedOperation(ERROR_MSG.SUBSCRIPTION_LIMIT_EXCEEDED));
            }
            if (isManagerLimit.BASIC_LIMIT.maxDownloads === 0) {
                return res.status(403).json(handleFailedOperation(ERROR_MSG.SUBSCRIPTION_LIMIT_EXCEEDED));
            }
        }
        if (subscription.plan === SUBSCRIPTION_MODEL.PRO) {
            if (isManagerLimit.PRO_LIMIT.maxManagers === 0) {
                return res.status(403).json(handleFailedOperation(ERROR_MSG.SUBSCRIPTION_LIMIT_EXCEEDED));
            }
            if (isManagerLimit.PRO_LIMIT.maxVessels === 0) {
                return res.status(403).json(handleFailedOperation(ERROR_MSG.SUBSCRIPTION_LIMIT_EXCEEDED));
            }
        }
        next();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error.message);
    }
};


export const setCaching = (req, res, next) => {
    const period = 60 * 5;
    if (req.method === "GET" && req.url !== "/api/v1/ping") {
        res.set("Cache-Control", `public, max-age=${period}`);
    } else {
        res.set("Cache-control", "no-store");
    }
    next();
};
