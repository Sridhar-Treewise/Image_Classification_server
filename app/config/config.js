
import dotenv from "dotenv";
dotenv.config();
const environment = process.env.NODE_ENV || "development";

const envFile = `.env.${environment}`;
dotenv.config({ path: envFile });


const database = {
    uri: process.env.MONGODB_URL
    // other database configuration properties
};

export { database };

