/* eslint-disable no-console */
import mongoose from "mongoose";
const customOptions = { useNewUrlParser: true, useUnifiedTopology: true };
export function connectToDatabase(uri, options = customOptions, PORT, app) {
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

