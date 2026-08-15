export const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://chat-app-kappa-seven-42.vercel.app",
];

export const isAllowedOrigin = (origin) => !origin || allowedOrigins.includes(origin);

export const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
