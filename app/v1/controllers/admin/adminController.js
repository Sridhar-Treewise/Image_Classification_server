import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Auth from "../../models/Auth.js";
import User from "../../models/User.js";
import Report from "../../models/Reports.js";
import _ from "lodash";
import { ERROR_MSG } from "../../../config/messages.js";
import { USER_TYPE } from "../../../common/constants.js";
import Organization from "../../models/Organizations.js";

export const createOrg = async (req, res) => {
    const { email, password, vessel_name } = req.body;
    const credentials = _.cloneDeep(req.body);
    const profileDetails = _.omit(credentials, ["password"]);
    try {
        const isExists = await Auth.findOne({ email });
        if (isExists) return res.status(409).send(ERROR_MSG.ALREADY_EXISTS);
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await Auth.create({ email, password: hashedPassword });
        if (result) {
            const profile = await User.create({ ...profileDetails, userType: USER_TYPE.ORGANISATION });
            if (!profile) return res.status(400).send(ERROR_MSG.PROFILE_NOT);
        }
        const token = jwt.sign({ userId: result._id, email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(201).json(token);
    } catch (error) {
        res.status(500).send("Something went wrong \n" + error);
    }
};

export const usersList = async (req, res) => {
    const { pageSize, pageIndex } = req.query;
    const parsedPageSize = parseInt(pageSize);
    const parsedPageIndex = parseInt(pageIndex);

    // Calculate skip value
    const skip = parsedPageIndex * parsedPageSize;
    const limit = parsedPageSize;

    try {
        const users = await User.find({ userType: { $ne: "Admin" } })
            .skip(skip)
            .limit(limit)
            .select("fullName email status userType");

        const totalCount = await User.countDocuments({ userType: { $ne: "Admin" } });
        const responseData = users.map(user => {
            return {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                status: user.status,
                userType: user.userType
            };
        });

        const paginationResult = {
            data: responseData,
            pageInfo: {
                pageSize: parsedPageSize,
                pageIndex: parsedPageIndex,
                totalCount
            }
        };

        res.status(200).json(paginationResult);
    } catch (error) {
        // Handle any errors that may occur during the query
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const dashboardList = async (req, res) => {
    try {
        const condClause = {
            userType: "Organization",
            designation: "FLEET_MANAGER"
        };
        const organizations = await Organization.countDocuments();
        const totalUsers = await User.countDocuments({ userType: { $ne: "Admin" } });
        const vessels = await User.countDocuments({ userType: "Vessel" });
        const reports = await Report.countDocuments({});
        const fleetManagers = await User.countDocuments(condClause);
        const cylinderImageCount = 0;
        const data = {
            organizations,
            totalUsers,
            vessels,
            reports,
            cylinderImageCount,
            fleetManagers
        };
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const restrictUser = async (req, res) => {
    const { id } = req.body;
    try {
        const findUser = await User.findOne({ _id: id });
        if (findUser.status === true) {
            await User.findOneAndUpdate({ _id: id }, { $set: { status: false } }, { new: true });
        } else {
            await User.findOneAndUpdate({ _id: id }, { $set: { status: true } }, { new: true });
        }
        res.status(200).json({ message: "Status updated successfully" });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const userDetails = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.query.id }).select("fullName email phone");
        const data = {
            fullName: user.fullName,
            email: user.email,
            phone: user.phone
        };
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const updateUser = async (req, res) => {
    const { fullName, email, phone, _id = "" } = req.body;
    try {
        const update = await User.findOneAndUpdate({ _id }, { $set: { fullName, email, phone } }, { new: true });
        if (!update) return res.status(404).send({ message: ERROR_MSG.UPDATE_FAILED });
        const data = {
            fullName: update.fullName,
            email: update.email,
            phone: update.phone,
            _id: update._id
        };
        res.status(201).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const updatePassword = async (req, res) => {
    const { password, confirmPassword, id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        if (password !== confirmPassword) return res.status(400).send({ message: ERROR_MSG.PASSWORD_MISMATCH });
        const update = await User.findOneAndUpdate({ _id: id }, { $set: { password: hashedPassword } }, { new: true });
        if (!update) return res.status(404).send({ message: ERROR_MSG.UPDATE_FAILED });
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const findUser = await User.findOne({ _id: id }).select("email fullName phone");
    res.status(200).json({ data: findUser });
};


export const vesselList = async (req, res) => {
    const { pageSize, pageIndex } = req.query;
    const parsedPageSize = parseInt(pageSize);
    const parsedPageIndex = parseInt(pageIndex);

    // Calculate skip value
    const skip = parsedPageIndex * parsedPageSize;
    const limit = parsedPageSize;

    try {
        const users = await User.find({ userType: "Vessel" })
            .skip(skip)
            .limit(limit)
            .select("-password -email -fullName")
            .populate("organizationBelongsTo", "company_name")
            .populate("officerAdmin", "fullName")
            .select("status userType");

        const totalCount = await User.countDocuments({ userType: "Vessel" });


        const paginationResult = {
            data: users,
            pageInfo: {
                pageSize: parsedPageSize,
                pageIndex: parsedPageIndex,
                totalCount
            }
        };

        res.status(200).json(paginationResult);
    } catch (error) {
        // Handle any errors that may occur during the query
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const getVesselById = async (req, res) => {
    const { id } = req.params;
    const vessel = await User.findOne({ _id: id })
        .select("-password -email -fullName -approvedStatus -status -phone -userType -designation")
        .populate("organizationBelongsTo", "company_name -_id")
        .populate("officerAdmin", "fullName");
    res.status(200).json({ data: vessel });
};
