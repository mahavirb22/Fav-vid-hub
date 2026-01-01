import connectDB from "../_db.js"
import Video from "../Video.js"

export default async function handler(req, res) {
  await connectDB()

  if (req.method === "GET") {
    try {
      const { youtubeId } = req.query

      const video = await Video.findOne({ youtubeId }).populate("category")

      if (!video) {
        return res.status(404).json({
          message: "Video not found",
        })
      }

      res.json(video)
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch video",
      })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}