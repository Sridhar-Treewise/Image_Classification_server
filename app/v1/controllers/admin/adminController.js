import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Auth from "../../models/Auth.js";
import User from "../../models/User.js";
import _ from "lodash"
import { ERROR_MSG, USER_TYPE } from "../../common/constants.js";

export const createOrg = async (req, res) => {
    const { email, password, vessel_name } = req.body;
    const credentials = _.cloneDeep(req.body)
    const profileDetails = _.omit(credentials, ['password']);
    try {
        const isExists = await Auth.findOne({ email: email });
        if (isExists) return res.status(409).send(ERROR_MSG.ALREADY_EXISTS);
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await Auth.create({ email, password: hashedPassword });
        if (result) {
            const profile = await User.create({ ...profileDetails, userType: USER_TYPE.ORGANISATION });
            if (!profile) return res.status(400).send(ERROR_MSG.PROFILE_NOT)
        }
        const token = jwt.sign({ userId: result._id, email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(201).json(token)
    } catch (error) {
        res.status(500).send("Something went wrong \n" + error)
    }
}