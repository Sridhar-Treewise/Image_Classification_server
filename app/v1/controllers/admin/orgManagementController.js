/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Auth from "../../models/Auth.js";
import User from "../../models/User.js";
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


export const orgList = async (req, res) => {
    const { pageSize, pageIndex, company_name } = req.query;
    const parsedPageSize = parseInt(pageSize);
    const parsedPageIndex = parseInt(pageIndex);

    // Calculate skip value
    const skip = parsedPageIndex * parsedPageSize;
    const limit = parsedPageSize;
    const filterConditions = {};
    if (company_name) {
        filterConditions.company_name = company_name;
    }

    try {
        const org = await Organization.find(filterConditions)
            .select("-admins")
            .skip(skip)
            .limit(limit)
            .populate("manager", "fullName");

        const totalCount = await Organization.countDocuments();


        const response = {
            data: org,
            pageInfo: {
                pageSize: parsedPageSize,
                pageIndex: parsedPageIndex,
                totalCount
            }
        };

        res.status(200).json(response);
    } catch (error) {
        // Handle any errors that may occur during the query
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};

export const getOrgById = async (req, res) => {
    const { id } = req.params;
    const org = await Organization.findOne({ _id: id }).populate("manager", "fullName").select("-admins");
    res.status(200).json({ data: org });
};
export const updateOrg = async (req, res) => {
    const { company_name, _id } = req.body;
    try {
        const update = await Organization.findOneAndUpdate({ _id }, { $set: { company_name } }, { new: true });
        if (!update) return res.status(404).send({ message: ERROR_MSG.UPDATE_FAILED });
        const data = {
            company_name: update.company_name,
            _id: update._id
        };
        res.status(201).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
