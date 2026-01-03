import mongoose from "mongoose"

const connectDB = async () => {
  try {
    console.log("Attempting MongoDB connection...")
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI)

    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log("MongoDB CONNECTED")
    console.log("DB name:", conn.connection.name)
    console.log("Host:", conn.connection.host)
  } catch (error) {
    console.error("MongoDB CONNECTION ERROR ❌")
    console.error(error)
    throw error
  }
}

export default connectDB
