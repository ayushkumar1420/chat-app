import "dotenv/config";
import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js"
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { app, server } from "./src/lib/socket.js";


const PORT = process.env.PORT || 5001;

app.set("trust proxy", 1); // Trust Render's reverse proxy for secure cookies

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://chat-app-kappa-seven-42.vercel.app",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);

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
