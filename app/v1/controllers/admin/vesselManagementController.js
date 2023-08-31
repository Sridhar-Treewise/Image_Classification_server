/* eslint-disable camelcase */

import User from "../../models/User.js";
import { ERROR_MSG } from "../../../config/messages.js";


export const vesselList = async (req, res) => {
    const { pageSize, pageIndex, vessel_name, imo_number } = req.query;
    const parsedPageSize = parseInt(pageSize);
    const parsedPageIndex = parseInt(pageIndex);

    // Calculate skip value
    const skip = parsedPageIndex * parsedPageSize;
    const limit = parsedPageSize;
    const filterConditions = {};
    const baseQuery = { userType: "Vessel" };

    if (vessel_name) {
        filterConditions["vesselDetails.vessel_name"] = vessel_name;
    }

    if (imo_number) {
        filterConditions["vesselDetails.imo_number"] = imo_number;
    }

    const queryConditions = { ...baseQuery, ...filterConditions };
    try {
        const users = await User.find(queryConditions)
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

