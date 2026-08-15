import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "https://chat-app-k2h9.onrender.com/api"
            : "https://chat-app-k2h9.onrender.com/api",

    withCredentials: true,
});