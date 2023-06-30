import createHttpError from "http-errors";

export const validator = async (schemaName, body, next) => {
    const value = await schemaName.validate(body);
    try {
        value.error
            ? next(createHttpError(422, value.error.details[0].message))
            : next();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
};
