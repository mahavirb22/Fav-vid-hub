import Category from "../models/Category.js"
import Video from "../models/Video.js"

const escapeRegex = (str) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * @desc Get all categories
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch categories" })
  }
}

/**
 * @desc Add new category
 */
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ message: "Category name is required" })
    }

    const trimmedName = name.trim()
    const safeName = escapeRegex(trimmedName)

    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${safeName}$`, "i") },
    })

    if (existing) {
      return res.status(409).json({ message: "Category already exists" })
    }

    const category = await Category.create({ name: trimmedName })
    res.status(201).json(category)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to add category" })
  }
}

/**
 * @desc Delete category
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    const videosCount = await Video.countDocuments({ category: id })
    if (videosCount > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete category that has videos" })
    }

    await Category.findByIdAndDelete(id)
    res.json({ message: "Category deleted successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to delete category" })
  }
}
