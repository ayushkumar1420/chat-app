import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

import { app, server } from "./src/lib/socket.js";

const PORT = process.env.PORT || 5001;

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://chat-app-kappa-seven-42.vercel.app",
];

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin
            // e.g. Postman/server-to-server
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.log("Blocked CORS origin:", origin);
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

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