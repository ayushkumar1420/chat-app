// const express = require('express');
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js"
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config()
import { app, server } from "./src/lib/socket.js";

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : ["http://localhost:5173", "http://127.0.0.1:5173", "https://chat-app-kappa-seven-42.vercel.app",],
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes)


connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log("server is running on PORT:" + PORT);
        });
    })
    .catch((error) => {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    });
