import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import _ from "lodash";
import { ERROR_MSG } from "../../../config/messages.js";


export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Invalid Credential" });
        const id = user._id.toString();
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) return res.status(403).json({ messages: "Invalid Credential" });
        const token = jwt.sign({ userId: id, email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const signUp = async (req, res) => {
    // const { error = {}, value = {} } = registerValidator(req.body);
    // if (error) return res.status(400).json({ message: error.details });
    const { email, password } = req.body;
    const credentials = _.cloneDeep(req.body);
    const profileDetails = _.omit(credentials, ["password"]);
    try {
        const isExists = await User.findOne({ email });
        if (isExists) return res.status(409).json({ message: ERROR_MSG.ALREADY_EXISTS });
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create({ ...profileDetails, password: hashedPassword });
        if (!result) return res.status(400).json({ message: ERROR_MSG.PROFILE_NOT });
        const token = jwt.sign({ userId: result._id, email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
