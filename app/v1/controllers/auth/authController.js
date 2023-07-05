import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import _ from "lodash";
import { ERROR_MSG } from "../../../config/messages.js";
import Organization from "../../models/Organizations.js";
import { USER_TYPE } from "../../../common/constants.js";
import { handleFailedOperation } from "../../../utils/apiOperation.js";
import { environment } from "../../../config/config.js";

// non admin  { email: 'johnwick@test.com', password: '123' }
// org { email: 'ajmal.n@test.com', password: '123' }
// admin  { email: 'adminn@scav.com', password: 'thedarkknight' }
export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid Credential" });
        const id = user._id.toString();
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) return res.status(401).json({ messages: "Invalid Credential" });
        const token = jwt.sign({ userId: id, email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(200).json({ token });
    } catch (error) {
        if (environment === "development") {
            // eslint-disable-next-line no-console
            console.log("error \n", error.message);
        }
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const signUp = async (req, res) => {
    const { email = "", password, organizationAdmin, vessel_name = "", userType = "" } = req.body;
    const credentials = _.cloneDeep(req.body);
    const profileDetails = _.omit(credentials, ["password"]);
    const domain = email.split("@")[1];
    try {
        const isExists = await User.findOne({ email });
        if (isExists) return res.status(409).json({ message: ERROR_MSG.ALREADY_EXISTS });
        const isVesselExists = await User.findOne({ vessel_name });
        if (isVesselExists && isVesselExists.vessel_name === vessel_name && userType !== USER_TYPE[1]) return res.status(409).json({ message: ERROR_MSG.ALREADY_EXISTS_VESSEL });
        const orgExists = await Organization.exists({ domain });
        if (orgExists && userType === USER_TYPE[1]) {
            return res.status(400).json({ message: ERROR_MSG.NOT_ALLOWED });
        }
        if (organizationAdmin && userType === USER_TYPE[1]) {
            return res.status(400).json({ message: ERROR_MSG.NOT_ALLOWED });
        }
        if (userType && userType === USER_TYPE[1]) { // org admin creation
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ ...profileDetails, userType, password: hashedPassword, vesselDetails: { vessel_name } });
            const code = domain.split(".")[0].toUpperCase() || "";
            const createOrg = await Organization.create({ domain, code, manager: user._id });
            createOrg.admins[0] = user._id;
            await createOrg.save();
            user.organizationBelongsTo = createOrg._id;
            user.vesselDetails.vessel_name = vessel_name;
            await user.save();
            if (!createOrg) return res.status(400).json({ message: ERROR_MSG.PROFILE_NOT });
            const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, { expiresIn: "2h" });
            res.status(201).json({ token });
        }
        if (userType && userType === USER_TYPE[0]) { // vessel user creation
            const org = await Organization.findOne({ domain });
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await User.create({ ...profileDetails, password: hashedPassword, userType, organizationBelongsTo: org._id, vesselDetails: { vessel_name } });
            if (!result) return res.status(400).json({ message: ERROR_MSG.PROFILE_NOT });
            const token = jwt.sign({ userId: result._id, email }, process.env.JWT_SECRET, { expiresIn: "2h" });
            res.status(201).json({ token });
        }
    } catch (error) {
        if (environment === "development") {
            // eslint-disable-next-line no-console
            console.log("error \n", error.message);
        }
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};


export const adminRegister = async (req, res) => {
    const { email, password } = req.body;
    const credentials = _.cloneDeep(req.body);
    const profileDetails = _.omit(credentials, ["password"]);
    try {
        const isExists = await User.exists({ email });
        if (isExists) return res.status(409).json({ message: ERROR_MSG.ADMIN_USER_ALREADY });
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create({ ...profileDetails, password: hashedPassword, userType: USER_TYPE[2] });
        const token = jwt.sign({ userId: result._id, email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const getAdmins = async (req, res) => {
    const { email } = req.body;
    const domain = email.split("@")[1] || "";
    try {
        const organization = await Organization.findOne({ domain }).populate({
            path: "admins",
            select: "_id fullName"
        });
        if (!organization) {
            return res.status(200).json(handleFailedOperation(ERROR_MSG.ADMINS_NOT_EXISTS));
        }
        // Get the array of admin IDs from the organization
        const adminIds = organization.admins.map(admin => admin._id);
        // Find all users based on the admin IDs
        const admins = await User.find({ _id: { $in: adminIds } });
        // Map the found admins to the desired format
        const adminData = admins.map(admin => ({
            id: admin._id,
            name: admin.fullName
        }));

        res.status(200).json({ data: adminData });
    } catch (error) {
        if (environment === "development") {
            // eslint-disable-next-line no-console
            console.log("error \n", error.message);
        }
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

