/* eslint-disable indent */
import jwt from "jsonwebtoken";
import User from "../v1/models/User.js";
// import { ERROR_MSG } from "../config/messages.js";
import { ERROR_CODE } from "../common/constants.js";
import { ERROR_MSG } from "../config/messages.js";

const config = process.env;
// TODO :- Add -> check blocked non blocked users
export const verifyToken = async (req, res, next) => {
    try {
        let token = req.query.token || req.headers.authorization;
        if (!token) return res.status(401).json({ message: ERROR_MSG.TOKEN_REQUIRED, errorCode: ERROR_CODE.TOKEN_REQUIRED });
        if (!token.length) return res.status(403).json({ message: ERROR_MSG.INVALID_TOKEN, errorCode: ERROR_CODE.INVALID_TOKEN });
        token = token.split(" ")[1];
        const decodedToken = jwt.verify(token, config.JWT_SECRET);
        if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
            return res
                .status(401)
                .json({ message: ERROR_MSG.TOKEN_EXPIRED, errorCode: ERROR_CODE.JWT_TOKEN_EXPIRED });
        }
        const { userId = "", userType = "" } = decodedToken;
        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(404).json({ message: ERROR_MSG.USER_NOT });
        if (!user.status) return res.status(401).json({ message: ERROR_MSG.USER_BLOCKED });
        req.user = userId;
        req.userType = userType;
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

