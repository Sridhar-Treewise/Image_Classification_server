/* eslint-disable camelcase */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import Subscription from "../../models/Subscriptions.js";
import _ from "lodash";
import { ERROR_MSG } from "../../../config/messages.js";
import Organization from "../../models/Organizations.js";
import { DESIGNATION, USER_TYPE } from "../../../common/constants.js";
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
        const token = jwt.sign({ userId: id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: "7d" });
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
    const { email = "", password, organizationAdmin, vessel_name = "", userType = "", company_name = "", newOrg = false, imo_number = "", cylinder_numbers = 1, plan } = req.body;
    const credentials = _.cloneDeep(req.body);
    const profileDetails = _.omit(credentials, ["password", "vessel_name", "company_name", "newOrgName"]); // Omit certain fields from the cloned credentials
    const domain = email.split("@")[1];
    let isVesselNameExists = null;
    try {
        const isExists = await User.findOne({ email });
        if (isExists) return res.status(409).json({ message: ERROR_MSG.ALREADY_EXISTS });
        const orgExists = await Organization.findOne({ company_name }).exec();
        if (orgExists) {
            if (_.get(isExists, "vesselDetails.vessel_name", "") === vessel_name && userType !== USER_TYPE[1]) return res.status(409).json({ message: ERROR_MSG.ALREADY_EXISTS_VESSEL });
            if (!organizationAdmin && userType === USER_TYPE[1]) return res.status(400).json({ message: ERROR_MSG.NOT_ALLOWED });
            isVesselNameExists = await User.findOne({ organizationBelongsTo: orgExists._id, "vesselDetails.vessel_name": vessel_name }).exec();
            if (isVesselNameExists) return res.status(400).json({ message: ERROR_MSG.ALREADY_EXISTS_VESSEL });
        }
        if (!orgExists && !organizationAdmin && userType === USER_TYPE[1] && newOrg) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ ...profileDetails, userType, password: hashedPassword, approvedStatus: true, designation: DESIGNATION[1] });
            const code = domain.split(".")[0].toUpperCase() || "";
            const createOrg = await Organization.create({ domain, code, manager: user._id, company_name });
            createOrg.admins[0] = user._id;
            await createOrg.save();
            const subscription = await Subscription.create({ manager: createOrg.manager, orgCode: createOrg.code, orgId: createOrg._id, plan });
            await subscription.save();
            user.organizationBelongsTo = createOrg._id;
            await user.save();
            user.subscription = subscription._id;
            await user.save();
            if (!createOrg) return res.status(400).json({ message: ERROR_MSG.PROFILE_NOT });
            const token = jwt.sign({ userId: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.status(201).json({ token });
        }
        if (orgExists && userType === USER_TYPE[0]) {
            const org = await Organization.findOne({ company_name });
            const findUser = await User.findOne({ _id: org.manager });
            if (org && !org.admins.includes(organizationAdmin)) return res.status(400).json({ message: ERROR_MSG.NO_ADMIN(company_name) });
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await User.create(
                {
                    ...profileDetails,
                    password: hashedPassword,
                    userType: USER_TYPE[0],
                    officerAdmin: organizationAdmin,
                    organizationBelongsTo: org._id,
                    subscription: findUser.subscription,
                    vesselDetails: { vessel_name, imo_number },
                    inspectionDetails: { cylinder_numbers }
                });
            if (!result) return res.status(400).json({ message: ERROR_MSG.PROFILE_NOT });
            const token = jwt.sign({ userId: result._id, userType: result.userType }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.status(201).json({ token });
        }
    } catch (error) {
        if (environment === "development") {
            // eslint-disable-next-line no-console
            console.log("error \n", error, "\n", error.message);
        }
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const orgRegistration = async (req, res) => {
    const { company_name, fullName, isNewOrg, email, phone, password, confirmPassword } = req.body;
    const domain = email.split("@")[1];
    try {
        const isExists = await User.findOne({ email });
        if (isExists) return res.status(409).json({ message: ERROR_MSG.ALREADY_EXISTS });
        if (password !== confirmPassword) return res.status(400).json({ message: ERROR_MSG.PASSWORD_MISMATCH });
        if (isNewOrg) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ userType: USER_TYPE[1], fullName, email, phone, password: hashedPassword, approvedStatus: true, designation: DESIGNATION[1] });
            const code = domain.split(".")[0].toUpperCase() || "";
            const createOrg = await Organization.create({ domain, code, manager: user._id, company_name });
            await createOrg.save();
            const subscription = await Subscription.create({ manager: createOrg.manager, orgCode: createOrg.code, orgId: createOrg._id });
            await subscription.save();
            user.organizationBelongsTo = createOrg._id;
            await user.save();
            user.subscription = subscription._id;
            await user.save();
            if (!createOrg) return res.status(400).json({ message: ERROR_MSG.PROFILE_NOT });
            const token = jwt.sign({ userId: user._id, userType: USER_TYPE[1] }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.status(201).json({ token });
        }
        if (!isNewOrg) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ userType: USER_TYPE[1], fullName, email, phone, password: hashedPassword, approvedStatus: true, designation: DESIGNATION[1] });
            const code = domain.split(".")[0].toUpperCase() || "";
            const createOrg = await Organization.create({ domain, code, manager: user._id, company_name });
            createOrg.admins.push(company_name);
            await createOrg.save();
            user.organizationBelongsTo = createOrg._id;
            await user.save();
            const findAdmin = await Subscription.findOne({ manager: company_name });
            user.subscription = findAdmin._id;
            await user.save();
            if (!createOrg) return res.status(400).json({ message: ERROR_MSG.PROFILE_NOT });
            const token = jwt.sign({ userId: user._id, userType: USER_TYPE[1] }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.status(201).json({ token });
        }
    } catch (error) {
        if (environment === "development") {
            // eslint-disable-next-line no-console
            console.log("error \n", error, "\n", error.message);
        }
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const vesselRegistration = async (req, res) => {
    const { company_name, fullName, email, phone, password, confirmPassword, vessel_name, imo_number, cylinder_numbers, officerAdmin, } = req.body;
    try {
        const isExists = await User.findOne({ email });
        if (isExists) return res.status(409).json({ message: ERROR_MSG.ALREADY_EXISTS });
        const orgExists = await Organization.findOne({ manager: officerAdmin });
        if (!orgExists) return res.status(404).json({ message: ERROR_MSG.ORG_NOT_FOUND });
        const findOrg = await User.findOne({ _id: officerAdmin });
        const orgDomain = findOrg.email.split("@")[1];
        const vesselDomain = req.body.email.split("@")[1];
        if (orgDomain !== vesselDomain) return res.status(422).json({ message: "Email domain do not match" });
        if (password !== confirmPassword) return res.status(400).json({ message: ERROR_MSG.PASSWORD_MISMATCH });
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create(
            {
                fullName,
                email,
                phone,
                password: hashedPassword,
                userType: USER_TYPE[0],
                officerAdmin,
                organizationBelongsTo: company_name,
                subscription: findOrg.subscription,
                vesselDetails: { vessel_name, imo_number },
                inspectionDetails: { cylinder_numbers }
            });
        if (!result) return res.status(400).json({ message: ERROR_MSG.PROFILE_NOT });
        const token = jwt.sign({ userId: result._id, userType: USER_TYPE[0] }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({ token });
    } catch (error) {
        if (environment === "development") {
            // eslint-disable-next-line no-console
            console.log("error \n", error, "\n", error.message);
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
        const token = jwt.sign({ userId: result._id, email }, process.env.JWT_SECRET, { expiresIn: "7d" });
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


export const getOrgs = async (req, res) => {
    try {
        const organizations = await Organization.find({}, "company_name _id");
        if (!organizations) {
            return res.status(200).json(handleFailedOperation(ERROR_MSG.ORG_NOT_FOUND));
        }
        const organizationsWithId = organizations.map(org => {
            return {
                id: org._id,
                name: org.company_name || ""
            };
        });
        res.status(200).json({ data: organizationsWithId });
    } catch (error) {
        if (environment === "development") {
            // eslint-disable-next-line no-console
            console.log("error \n", error.message);
        }
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const getAdminByOrg = async (req, res) => {
    // eslint-disable-next-line no-unused-vars
    const { id, name } = req.body;
    try {
        const org = await Organization.findOne({ _id: id }).select("admins");
        if (org.admins.length < 1) {
            return res.status(200).json(handleFailedOperation(ERROR_MSG.ADMINS_NOT_EXISTS));
        }

        const admins = await User.find({ _id: { $in: org.admins } });
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
