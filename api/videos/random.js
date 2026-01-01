import connectDB from "../_db.js"
import Video from "../Video.js"
import Category from "../Category.js"

export default async function handler(req, res) {
  await connectDB()

  if (req.method === "GET") {
    try {
      const limit = Number(req.query.limit) || 8
      const { category: categoryName } = req.query

      const pipeline = []

      if (categoryName && categoryName !== "All") {
        // Find category by name
        const category = await Category.findOne({
          name: { $regex: new RegExp(`^${categoryName}$`, "i") },
        })
        if (category) {
          pipeline.push({ $match: { category: category._id } })
        }
      }

      pipeline.push({ $sample: { size: limit } })

      const videos = await Video.aggregate(pipeline).then(async (videos) => {
        // Populate categories
        const categoryIds = videos.map(v => v.category)
        const categories = await Category.find({ _id: { $in: categoryIds } })
        const categoryMap = categories.reduce((map, cat) => {
          map[cat._id.toString()] = cat
          return map
        }, {})

        return videos.map(video => ({
          ...video,
          category: categoryMap[video.category.toString()],
        }))
      })

      res.json(videos)
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch videos",
        error: error.message,
      })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}