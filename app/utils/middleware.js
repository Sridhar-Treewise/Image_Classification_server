/* eslint-disable indent */
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ERROR_MSG } from "../common/constants.js";
const config = process.env;

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.query.token || req.headers.authorization;
        if (!token) return res.status(401).send("Token Required for accessing this resource");
        if (!token.length) return res.status(403).send("Invalid token");
        // token = token.split(" ")[1];
        const decodedToken = jwt.verify(token, config.JWT_SECRET);
        const { userId = "" } = decodedToken;
        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(404).send(ERROR_MSG.USER_NOT);
        if (!user.status) return res.status(401).send("User blocked from accessing resources");
        req.user = userId;
        next();
    } catch (error) {
        res.status(401).send(error.message);
    }
};
