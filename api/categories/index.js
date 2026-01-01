import connectDB from "../_db.js"
import Category from "../Category.js"

export default async function handler(req, res) {
  await connectDB()

  if (req.method === "GET") {
    // Get all categories
    try {
      const categories = await Category.find().sort({ createdAt: -1 })
      res.json(categories)
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch categories",
        error: error.message,
      })
    }
  } else if (req.method === "POST") {
    // Add new category
    try {
      const { name } = req.body

      if (!name) {
        return res.status(400).json({
          message: "Category name is required",
        })
      }

      const trimmedName = name.trim()

      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
      })

      if (existingCategory) {
        return res.status(409).json({
          message: "Category already exists",
        })
      }

      const category = await Category.create({
        name: trimmedName,
      })

      res.status(201).json(category)
    } catch (error) {
      res.status(500).json({
        message: "Failed to add category",
        error: error.message,
      })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}