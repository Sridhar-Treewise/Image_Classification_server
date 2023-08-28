import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Auth from "../../models/Auth.js";
import User from "../../models/User.js";
import Report from "../../models/Reports.js";
import _ from "lodash";
import { ERROR_MSG } from "../../../config/messages.js";
import { USER_TYPE } from "../../../common/constants.js";

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
            .select("fullName email status userType")
            .exec();

        const totalCount = await User.countDocuments({ userType: { $ne: "Admin" } });
        const responseData = users.map(user => {
            return {
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
        const organizations = await User.countDocuments({ userType: "Organization" });
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

