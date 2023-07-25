import dotenv from "dotenv";
import { database } from "./config.js";
dotenv.config();

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const databaseConfig = {
    development: {
        uri: database.uri,
        options
    },
    production: {
        uri: database.uri,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    local: {
        uri: database.uri,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
};

export default databaseConfig;
