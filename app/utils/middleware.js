/* eslint-disable indent */
import jwt from "jsonwebtoken";
import User from "../v1/models/User.js";
import { ERROR_MSG } from "../config/messages.js";

const config = process.env;
// TODO :- check JWT_SECRET
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.query.token || req.headers.authorization;
        if (!token) return res.status(401).json({ message: "Token Required for accessing this resource" });
        if (!token.length) return res.status(403).json({ message: "Invalid token" });
        // token = token.split(" ")[1];
        const decodedToken = jwt.verify(token, config.JWT_SECRET);
        const { userId = "" } = decodedToken;
        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(404).json(ERROR_MSG.USER_NOT);
        if (!user.status) return res.status(401).json({ message: "User blocked from accessing resources" });
        req.user = userId;
        next();
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};
