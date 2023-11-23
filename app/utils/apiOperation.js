import { API_RESULT_CODE } from "../config/constant.js";

export const handleSuccessOperation = (jsonData = {}) => {
    return { data: jsonData, result: API_RESULT_CODE.SUCCESS };
};


export const handleFailedOperation = (errorDescription = "Unknown error occurred", title = "") => {
    return { data: null, result: API_RESULT_CODE.FAILURE, errorDescription, title };
};

