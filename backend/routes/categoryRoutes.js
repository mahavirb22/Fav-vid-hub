import express from "express"
import {
  getAllCategories,
  addCategory,
  deleteCategory,
} from "../controllers/categoryController.js"

const router = express.Router()

// Get all categories
router.get("/", getAllCategories)

// Add new category
router.post("/", addCategory)

// Delete category
router.delete("/:id", deleteCategory)

export default router