/* eslint-disable indent */
export const USER_TYPE = ["Vessel", "Organization", "Admin"];

export const KEY_USER_TYPE = {
    VESSEL: USER_TYPE[0],
    ORG: USER_TYPE[1],
    ADMIN: USER_TYPE[2]
};
export const SUBSCRIPTION_MODEL = {
    FREE: "FREE_TRIAL",
    BASIC: "BASIC",
    PRO: "PRO",
    CUSTOM: "CUSTOM"
};
export const SUBSCRIPTION_AMOUNT = {
    FREE: 0,
    BASIC: 100,
    PRO: 200,
    CUSTOM: 300
};

export const DESIGNATION = [
    "CHIEF_OFFICER",
    "FLEET_MANAGER",
    "CREW"
];
export const ERROR_CODE = {
    INVALID_TOKEN: 9401,
    TOKEN_REQUIRED: 9402,
    JWT_TOKEN_EXPIRED: 9000
};
export const HTTP_HEADER = {
    headers: {
        "Content-Type": "multipart/form-data",
        "Accept-Encoding": "gzip, deflate, br"
    }
};

export const HTTP_HEADER_IMG = {
    headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br"
    }
};

export const DEFECT_DETECTION = {
    PREDICT_IMAGE: "https://scavaiapp.azurewebsites.net/predict",
    EXPORT_PDF: "https://defectdetectionrings.azurewebsites.net/pdf",
    EXPORT_EXCEL: "https://defectdetectionrings.azurewebsites.net/excel"
};

export const DOC_TYPE = {
    EXCEL: "xls",
    PDF: "pdf"
};

//  PREDICT_IMAGE: "https://scavaiapp.azurewebsites.net/predict",

// predict
// input- base64string

// output:- defect_df=  {"lub":def_section_lub_ls, "surf":def_section_surf_ls,"dep":def_section_dep_ls,"brk":def_section_brk_ls, "image":base64img}
// {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(saveDataDB),
//   }


// {
//     "user": {
//         "_id": "64140bbcca0dfbcd9a68e193",
//             "email": "sridhar@test.com",
//                 "mobile": "987654321"
//     },
//     "info": {
//         "company_name": "One piece",
//             "vessel_name": "Luffy",
//                 "imo_number": "2121212",
//                     "manufacturer": "manufactur",
//                         "type_of_engine": "Sailing",
//                             "vessel_type": "Boat",
//                                 "inspection_date": "2023-06-01",
//                                     "total_running_hours": "66565",
//                                         "running_hrs_since_last": "100",
//                                             "cyl_oil_Type": "5454",
//                                                 "cyl_oil_consump_Ltr_24hr": "54645",
//                                                     "normal_service_load_in_percent_MCR": "65",
//                                                         "cylinder_numbers": "6"
//     },
//     "predictionInfo": {
//         "date": "2023-06-01",
//             "total_running_hours": "66565",
//                 "cylinder1": {
//             "lubrication": {
//                 "ring1": "*",
//                     "ring2": "*",
//                         "ring3": "*",
//                             "ring4": "*"
//             },
//             "surface": {
//                 "ring1": "*",
//                     "ring2": "*",
//                         "ring3": "*",
//                             "ring4": "*"
//             },
//             "deposit": {
//                 "ring1": "*",
//                     "ring2": "*",
//                         "ring3": "*",
//                             "ring4": "*"
//             },
//             "breakage": {
//                 "ring1": "*",
//                     "ring2": "*",
//                         "ring3": "*",
//                             "ring4": "*"
//             },
//             "image": "",
//                 "remark": ""
//         }
//     }
// }