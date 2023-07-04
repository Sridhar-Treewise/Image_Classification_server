/* eslint-disable indent */
import jwt from "jsonwebtoken";
// import User from "../v1/models/User.js";
// import { ERROR_MSG } from "../config/messages.js";
import { ERROR_CODE } from "../common/constants.js";

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
        const { userId = "" } = decodedToken;
        // const user = await User.findOne({ _id: userId });
        // if (!user) return res.status(404).json({ message: ERROR_MSG.USER_NOT });
        // if (!user.status) return res.status(401).json({ message: "User blocked from accessing resources" });
        req.user = userId;
        next();
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

