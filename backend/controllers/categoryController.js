import Category from "../models/Category.js"

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 })
    res.json(categories)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    })
  }
}

/**
 * @desc    Add new category
 * @route   POST /api/categories
 */
export const addCategory = async (req, res) => {
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
}

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findById(id)

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      })
    }

    // Check if category is used by any videos
    const Video = (await import("../models/Video.js")).default
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
}