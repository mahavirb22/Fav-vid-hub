import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Snowfall from "react-snowfall"
import { addVideo, fetchCategories, addCategory } from "../services/videoApi"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"

export default function AddVideo() {
  const navigate = useNavigate()

  const [youtubeLink, setYoutubeLink] = useState("")
  const [category, setCategory] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [mode, setMode] = useState("existing")
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories()
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Failed to load categories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }
    loadCategories()
  }, [])

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const addedCategory = await addCategory(newCategory.trim())
      setCategories(prev => [...prev, addedCategory])
      setCategory(addedCategory.name)
      setNewCategory("")
      setMode("existing")
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add category")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const finalCategory =
      mode === "new" ? newCategory.trim() : category

    if (!youtubeLink || !finalCategory) {
      alert("Please provide YouTube link and category")
      return
    }

    try {
      setLoading(true)

      await addVideo({
        youtubeLink,
        category: finalCategory,
      })

      alert("Video added successfully 🎉")
      navigate(-1)
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add video"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 px-4 overflow-hidden">

      <Snowfall
        snowflakeCount={80}
        color="#3b82f6"
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 w-full max-w-md">

        {/* 🔙 Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ x: -4 }}
          className="
            flex items-center gap-2
            text-sm font-medium
            text-gray-700
            mb-4
          "
        >
          <ArrowLeft size={18} />
          Back
        </motion.button>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            bg-white
            rounded-2xl
            shadow-xl
            p-6
          "
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            Add New Video
          </h2>

          {/* (FORM CONTENT UNCHANGED BELOW) */}
          {/* YouTube Link */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">
              YouTube Video Link
            </label>
            <input
              type="url"
              required
              placeholder="https://youtube.com/watch?v=..."
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none"
            />
          </div>

          {/* Mode Tabs */}
          <div className="flex mb-4 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setMode("existing")}
              className={`flex-1 py-2 text-sm font-medium ${
                mode === "existing"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
            >
              Existing Category
            </button>
            <button
              type="button"
              onClick={() => setMode("new")}
              className={`flex-1 py-2 text-sm font-medium ${
                mode === "new"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
            >
              New Category
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === "existing" && (
              <motion.select
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mb-5 px-4 py-2 rounded-lg border border-gray-300"
                disabled={loadingCategories}
              >
                <option value="">
                  {loadingCategories ? "Loading categories..." : "Choose category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </motion.select>
            )}

            {mode === "new" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-5"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-white font-medium"
          >
            {loading ? "Adding..." : "Add Video"}
          </motion.button>
        </motion.form>
      </div>
    </div>
  )
}
