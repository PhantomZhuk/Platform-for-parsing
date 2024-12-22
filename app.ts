import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import adminRoutes from './routes/admin.js';
import apiRoutes from './routes/api.js';
import mainRoutes from './routes/main.js';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
dotenv.config();

const PORT: number | string = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI!)
    .then(() => {
        console.log("Connected to MongoDB");
    });

const app = express();

app.use(express.static("public"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors())
    .use('/admin', adminRoutes)
    .use('/api', apiRoutes)
    .use('/', mainRoutes)
    .use(cookieParser())
    .listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });