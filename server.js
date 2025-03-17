import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import transactionRoutes from "./routes/transactionRoutes.js";
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("MongoDB Connected Successfully 🚀");
});

app.use("/api/transactions", transactionRoutes);


app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
