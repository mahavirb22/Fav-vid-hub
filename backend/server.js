import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import videoRoutes from "./routes/videoRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/videos", videoRoutes)
app.use("/api/categories", categoryRoutes)

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
