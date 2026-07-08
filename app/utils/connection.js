import mongoose from "mongoose";
import { requireEnv } from "./env";
let isConnected = false;
export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected && mongoose.connection.readyState === 1) {
        console.log("mongodb is already connected");
        return;
    }

    // Validate outside the try so a missing var fails loudly instead of being swallowed.
    const dbUrl = requireEnv("DB_URL", "your MongoDB Atlas connection string");
    try {
        await mongoose.connect(`${dbUrl}meripanchayat`, {
            dbName: "meripanchayat",
            // Fail fast (10s) if the cluster is unreachable — e.g. the current IP
            // is not whitelisted in Atlas Network Access — instead of hanging.
            serverSelectionTimeoutMS: 10000,
         })
        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        isConnected = false;
        console.log(error);
        // Re-throw so callers get a clear DB error instead of a later,
        // confusing "buffering timed out" from queued model operations.
        throw new Error(`Database connection failed: ${error.message}`);
    }
}
