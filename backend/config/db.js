import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI

// Delay throwing until we actually try to connect so imports don't crash in serverless environments
// and allow the app to start while surfacing clear errors at connection time.

const connectDB = async () => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 1) {
    return
  }

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables")
  }

  try {
    mongoose.set("strictQuery", true)

    await mongoose.connect(MONGO_URI, {
      bufferCommands: false
    })

    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    throw error
  }
}

export default connectDB
