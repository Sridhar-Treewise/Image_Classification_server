import _ from "lodash";
import { ERROR_MSG } from "../../../config/messages.js";
import User from "../../models/User.js";


export const getProfileDetails = async (req, res) => {
    const id = req.user || "";
    try {
        const result = await User.findOne({ _id: id }).populate("organizationBelongsTo", "_id company_name");
        const profileDetail = _.omit(result, ["vesselDetails"]);
        if (!result) return res.status(404).json({ message: ERROR_MSG.PROFILE_NOT });
        res.status(200).json({ data: profileDetail });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
