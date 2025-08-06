const allowedOrigins = [
    "https://life-project-two.vercel.app/",
    "https://life-dashboard-alpha.vercel.app/",
    "http://localhost:5173/",
];

export const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("No permido por CORS"));
        }
    },
    credentials: true,
}