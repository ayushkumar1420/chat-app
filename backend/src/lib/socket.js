import "dotenv/config";
import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import { allowedOrigins } from "../config/cors.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

const userSocketMap = {};

const getCookie = (cookieHeader, name) => {
    const cookie = cookieHeader
        ?.split(";")
        .map((value) => value.trim())
        .find((value) => value.startsWith(`${name}=`));

    return cookie?.slice(name.length + 1);
};

// The client sends userId for compatibility, but the cookie is the source of truth.
io.use((socket, next) => {
    try {
        const token = getCookie(socket.handshake.headers.cookie, "jwt");
        if (!token) return next(new Error("Unauthorized - No token provided"));

        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = userId;
        next();
    } catch {
        next(new Error("Unauthorized - invalid token"));
    }
});

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);

        if (userId) {
            delete userSocketMap[userId];
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
