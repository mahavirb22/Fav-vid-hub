import connectDB from "../_db.js"
import Video from "../Video.js"
import Category from "../Category.js"

export default async function handler(req, res) {
  await connectDB()

  if (req.method === "GET") {
    try {
      const { category: categoryName, excludeId } = req.query
      const limit = Number(req.query.limit) || 6

      if (!categoryName) {
        return res.status(400).json({
          message: "Category is required",
        })
      }

      // Find category by name
      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${categoryName}$`, "i") },
      })

      if (!category) {
        return res.json([])
      }

      const query = { category: category._id }

      if (excludeId) {
        query.youtubeId = { $ne: excludeId }
      }

      const videos = await Video.find(query)
        .populate("category")
        .sort({ createdAt: -1 })
        .limit(limit)

      res.json(videos)
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch related videos",
        error: error.message,
      })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}