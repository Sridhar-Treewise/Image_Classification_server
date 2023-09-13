
/* eslint-disable no-undef */
/* eslint-disable camelcase */

import User from "../../models/User.js";
import { ERROR_MSG } from "../../../config/messages.js";
import Organization from "../../models/Organizations.js";


export const orgList = async (req, res) => {
    const { pageSize, pageIndex, company_name, orgManager } = req.query;
    const parsedPageSize = parseInt(pageSize);
    const parsedPageIndex = parseInt(pageIndex);

    // Calculate skip value
    const skip = parsedPageIndex * parsedPageSize;
    const limit = parsedPageSize;
    const filterConditions = {};
    if (company_name) {
        filterConditions.company_name = company_name;
    }
    if (orgManager) {
        const findUser = await User.find({ fullName: orgManager, userType: "Organization" });
        const organizationIdArray = findUser.map(user => user.organizationBelongsTo);
        filterConditions._id = { $in: organizationIdArray };
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
