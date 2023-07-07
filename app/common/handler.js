/* eslint-disable no-console */
import { ERROR_MSG } from "../config/messages.js";

// Error handler
const errorHandler = (err, req, res, next) => {
    res.status(400); // Bad Request
    console.log(err);
    res.json({ errorTitle: "Bad Request", message: err.message || ERROR_MSG.ERROR_OCCURRED });
    next();
};

// Routes not found middleware
const notFoundHandler = (req, res, next) => {
    res.status(404);
    res.json({ message: "Requested Resource not found." });
    next();
};

export { errorHandler, notFoundHandler };
