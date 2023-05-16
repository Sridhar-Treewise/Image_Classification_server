import dotenv from "dotenv";
import { database } from "./config.js";
dotenv.config();


const databaseConfig = {
    development: {
        uri: database.uri,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    production: {
        uri: database.uri,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
};

export default databaseConfig;
