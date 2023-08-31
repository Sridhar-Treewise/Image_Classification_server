import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { ERROR_MSG } from "../../../config/messages.js";

export const usersList = async (req, res) => {
    const { pageSize, pageIndex, email, phone, fullName } = req.query;
    const parsedPageSize = parseInt(pageSize);
    const parsedPageIndex = parseInt(pageIndex);
    // Calculate skip value
    const skip = parsedPageIndex * parsedPageSize;
    const limit = parsedPageSize;
    const baseQuery = { userType: { $ne: "Admin" } };

    const filterConditions = {};

    if (email) {
        filterConditions.email = email;
    }

    if (fullName) {
        filterConditions.fullName = { $regex: fullName, $options: "i" };
    }

    if (phone) {
        filterConditions.phone = phone;
    }
    const queryConditions = { ...baseQuery, ...filterConditions };

    try {
        const users = await User.find(queryConditions)
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

