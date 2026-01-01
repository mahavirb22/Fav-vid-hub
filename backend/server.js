import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import videoRoutes from "./routes/videoRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"

/* Load environment variables */
dotenv.config()

/* Initialize express app */
const app = express()

/* Connect MongoDB (serverless-safe) */
connectDB()

/* Middleware */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

/* Routes */
app.use("/api/videos", videoRoutes)
app.use("/api/categories", categoryRoutes)

/* Health check */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully"
  })
})

/* Global error handler */
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  })
})

/* ❗ IMPORTANT for Vercel */
export default app
