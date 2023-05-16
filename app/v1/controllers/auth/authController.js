/* eslint-disable indent */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import _ from "lodash";
import { ERROR_MSG } from "../../../common/constants.js";


export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send("Invalid Credential");
        const id = user._id.toString();
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) return res.status(403).send("Invalid credentials");
        const token = jwt.sign({ userId: id, email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send(`${ERROR_MSG.SOMETHING_WENT} \n ${error.message}`);
    }
};

export const signUp = async (req, res) => {
    const { email, password } = req.body;
    const credentials = _.cloneDeep(req.body);
    const profileDetails = _.omit(credentials, ["password"]);
    try {
        const isExists = await User.findOne({ email });
        if (isExists) return res.status(409).send(ERROR_MSG.ALREADY_EXISTS);
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create({ ...profileDetails, password: hashedPassword });
        if (!result) return res.status(400).send(ERROR_MSG.PROFILE_NOT);
        const token = jwt.sign({ userId: result._id, email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).send(`${ERROR_MSG.SOMETHING_WENT} \n ${error.message}`);
    }
};
