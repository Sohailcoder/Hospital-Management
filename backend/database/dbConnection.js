// dbConnection.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
      useUnifiedTopology: true,
        });
        console.log("Database connected");
    } catch (err) {
        console.error("Error connecting to database:", err);
        process.exit(1); // Exit process on connection failure
    }
};
