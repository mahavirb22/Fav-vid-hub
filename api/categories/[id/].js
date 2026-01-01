import connectDB from "../_db.js"
import Category from "../Category.js"
import Video from "../Video.js"

export default async function handler(req, res) {
  await connectDB()

  if (req.method === "DELETE") {
    try {
      const { id } = req.query

      const category = await Category.findById(id)

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        })
      }

      // Check if category is used by any videos
      const videosCount = await Video.countDocuments({ category: id })

      if (videosCount > 0) {
        return res.status(400).json({
          message: "Cannot delete category that has videos",
        })
      }

      await Category.findByIdAndDelete(id)

      res.json({
        message: "Category deleted successfully",
      })
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete category",
        error: error.message,
      })
    }
  } else {
    res.setHeader("Allow", ["DELETE"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}