import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js";
import { ObjectId } from "mongoose";
const config = process.env;

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.query.token || req.headers['authorization'];
        if (!token) return res.status(401).send("Token Required for accessing this resource")
        if (!token.length) return res.status(403).send("Invalid token")
        // token = token.split(" ")[1];
        const decodedToken = jwt.verify(token, config.JWT_SECRET)
        const { userId = "", email = "" } = decodedToken;
        const user = await Auth.findOne({ _id: userId });
        if (!user.status) return res.status(401).send("User blocked from accessing resources")
        req.user = userId
        next()
    } catch (error) {
        res.status(401).send(error.message)
    }

} 