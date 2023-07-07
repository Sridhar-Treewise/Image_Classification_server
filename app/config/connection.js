/* eslint-disable no-console */
import mongoose from "mongoose";

export function connectToDatabase(uri, options, PORT, app) {
    return mongoose
        .connect(uri, options)
        .then(() => {
            console.log("DB Connected");
            app.listen(PORT, () => {
                const env = process.env.NODE_ENV;
                console.log(`app running in ${env} mode at ${PORT}`);
            });
        })
        .catch((err) => {
            console.log(`Error connecting database \n ${err.message}`);
        });
}