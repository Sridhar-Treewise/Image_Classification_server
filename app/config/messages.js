/* eslint-disable camelcase */
export const ERROR_MSG = {
    ALREADY_EXISTS: "Email already exists, please try different email",
    PROFILE_NOT: "Profile not created, try again",
    SOMETHING_WENT: "Something Went Wrong",
    USER_NOT: "User not found",
    ORG_ADMIN_NOT: "Organization Admin field required for registering",
    ADMIN_USER_ALREADY: "Administrator already exists",
    ADMINS_NOT_EXISTS: "For given domain administrator not exists",
    NO_DETAILS: "No details found",
    ALREADY_EXISTS_VESSEL: "Vessel Name already exists, Contact support Team / Contact support Team your Administrator",
    ERROR_OCCURRED: "An error has occurred",
    NOT_ALLOWED: "Not Allowed, choose one Administrator",
    NO_ADMIN: (company_name = "") => ` No administrator account found for the organization '${company_name}'. Please ensure that a valid administrator account exists and try again.`,
    TRY_AGAIN: "Please try again,",
    UPDATE_FAILED: "Updating Failed",
    ORG_NOT_FOUND: "No Organization list found",
    PAYLOAD_INVALID: "Invalid Payload",
    FORBIDDEN: "You don't have permission to access this resource",
    FAILED_SAVE: (reason = "") => `Failed to save data :${reason}`,
    SERVICE_NOT_AVAILABLE: "The resource is temporarily unavailable. Please try again later."

};


export const SUCCESS_MESSAGE = {
    CREATED: "Created Successfully",
    UPDATED: "Updated Successfully"
};

export const schemaMessages = {
    nameRequired: "Name Required",
    passwordAtLeast3: "Password must be at least 3 characters",
    passwordNotGT30: "Password cannot exceed 30 characters",
    passwordRequired: "Password is required",
    emailString: "Email must be a string",
    invalidEmail: "Invalid email format",
    emailRequired: "Email is required",
    dateRequired: (type = "") => `${type} Date Required`,
    dateNumber: "Inspection Date Must be timestamp in Unix format"
};
