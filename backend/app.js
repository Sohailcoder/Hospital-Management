import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from './router/messageRouter.js';
import userRouter from './router/userRouter.js';
import cors from "cors";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import  appointmentRouter  from "./router/appointmentRouter.js";

config({ path: "./config/config.env" });

const app = express();

const corsOptions = {
  origin: [
    'https://hospital-management-dashboard-xihy.onrender.com',
    'http://localhost:5173',
    'https://homepage-patient.netlify.app',
  ],
  credentials: true, // Allow credentials
};


app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// File upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

// Router setup
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/appointment', appointmentRouter);

// Database connection
dbConnection();

//Error handling middleware
app.use(errorMiddleware)
export default app;
