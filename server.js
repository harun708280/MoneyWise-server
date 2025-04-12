import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import userSavingsRoutes from "./routes/userSavingsRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ["https://work-wave-by-harun.vercel.app"], 
    credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes); 
app.use("/api/savings",userSavingsRoutes)

app.get("/", (req, res) => {
    res.send("MongoDB Connected Successfully 🚀");
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
