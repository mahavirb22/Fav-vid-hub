import mongoose from "mongoose"

let isConnected = false

const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false
    })

    isConnected = true
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection failed:", error.message)
    throw error   // ❗ Do NOT use process.exit() on Vercel
  }
}

export default connectDB
