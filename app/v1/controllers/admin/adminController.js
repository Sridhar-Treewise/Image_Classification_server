
import User from "../../models/User.js";
import Report from "../../models/Reports.js";
import { ERROR_MSG } from "../../../config/messages.js";
import Organization from "../../models/Organizations.js";

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
        const cylinderImageCount = 0; // TODO
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

