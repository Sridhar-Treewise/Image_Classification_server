
import Report from "../../models/Reports.js";
import User from "../../models/User.js";
import { ERROR_MSG } from "../../../config/messages.js";

export const vesselList = async (req, res) => {
    const id = req.user;
    try {
        const result = await User.find({ officerAdmin: id });
        const vesselNames = result.map(user => user.vesselDetails.vessel_name);
        // eslint-disable-next-line no-shadow
        const vesselIds = result.map((id) => id._id);
        const countReports = await Report.aggregate([
            { $match: { vesselId: { $in: vesselIds } } },
            { $group: { _id: null, count: { $sum: 1 }, latestReport: { $max: "$inspection_date" } } },
            { $project: { _id: 0, "Inspection Count": "$count", latestReport: 1 } }
        ]);
        const InspectionData = { vesselNames, countReports };
        res.status(200).json(InspectionData);
    } catch (error) {
        // Handle any errors that may occur during the query
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const pendingVesselList = async (req, res) => {
    const id = req.user;
    try {
        const result = await User.find({ approvedStatus: false, officerAdmin: id })
            .select("vesselDetails.vessel_name email vesselDetails.imo_number");
        res.status(200).json(result);
    } catch (error) {
        // Handle any errors that may occur during the query approveRequest
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const approveRequest = async (req, res) => {
    const id = req.params.id;
    try {
        const updateStatus = await User.findOneAndUpdate({ _id: id }, { $set: { approvedStatus: true } }, { new: true });
        if (updateStatus.approvedStatus) return res.status(200).json({ message: "Status updated successfully" });
    } catch (error) {
        // Handle any errors that may occur during the query
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
export const createVessel = async (req, res) => {
    try {
        const vesselExists = await User.findOne({
            $or: [{ email: req.body.email }, { vessel_name: req.body.vessel_name }]
        });
        if (vesselExists) return res.status(409).send(ERROR_MSG.ALREADY_EXISTS);
        const vessel = await User.create(req.body);
        if (!vessel) return res.status(400).send(ERROR_MSG.VESSEL_NOT);
        res.status(200).json({ message: "Vessel created successfully" });
    } catch (error) {
        // Handle any errors that may occur during the query
        res.status(500).json({ errorTitle: ERROR_MSG.SOMETHING_WENT, message: error.message });
    }
};
