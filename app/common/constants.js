/* eslint-disable indent */
export const USER_TYPE = ["Vessel", "Organization", "Admin"];

export const SUBSCRIPTION_MODEL = {
    BASIC: "BASIC",
    STANDARD: "STANDARD",
    PREMIUM: "PREMIUM"
};

export const DESIGNATION = [
    "CHIEF_OFFICER",
    "OFFICER",
    "CREW"
];
export const ERROR_CODE = {
    INVALID_TOKEN: 9401,
    TOKEN_REQUIRED: 9402,
    JWT_TOKEN_EXPIRED: 9000
};


export const DEFECT_DETECTION = {
    PREDICT_IMAGE: "https://defectdetectionrings.azurewebsites.net/",
    EXPORT_PDF: "https://defectdetectionrings.azurewebsites.net/pdf",
    EXPORT_EXCEL: "https://defectdetectionrings.azurewebsites.net/excel"
};

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