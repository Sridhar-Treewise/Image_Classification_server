import { ERROR_MSG } from "../../../config/messages.js";
import User from "../../models/User.js";
import { USER_TYPE } from "../../../common/constants.js";
import Organization from "../../models/Organizations.js";


export const getProfileDetails = async (req, res) => {
    const id = req.user || "";
    const userType = req.query.userType;
    let result = {};
    try {
        result = await User.findOne({ _id: id })
            .populate("organizationBelongsTo", "_id company_name")
            .populate("subscription")
            .select("designation email phone fullName organizationBelongsTo subscription userType approvedStatus vesselDetails");
        if (!result) return res.status(404).json({ message: ERROR_MSG.PROFILE_NOT });
        if (userType === USER_TYPE[1]) {
            result = {
                fullName: result.fullName,
                email: result.email,
                phone: result.phone,
                company_name: result.organizationBelongsTo.company_name
            };
        }
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const updateProfile = async (req, res) => {
    const id = req.user;
    const findUser = await User.findOne({ _id: id });
    try {
        const updateData = {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone
        };
        const result = await User.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true });
        const org = await Organization.findByIdAndUpdate({ _id: findUser.organizationBelongsTo }, { $set: { company_name: req.body.company_name } }, { new: true });
        if (!result && !org) return res.status(404).send({ message: ERROR_MSG.UPDATE_FAILED });
        const data = {
            fullName: result.fullName,
            email: result.email,
            phone: result.phone,
            company_name: org.company_name
        };
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
