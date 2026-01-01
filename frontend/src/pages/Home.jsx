import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import Snowfall from "react-snowfall"
import { fetchRandomVideos, fetchCategories } from "../services/videoApi"

export default function Home() {
  const navigate = useNavigate()

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const [categories, setCategories] = useState(["All"])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories()
        setCategories(["All", ...fetchedCategories.map(cat => cat.name)])
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        const data = await fetchRandomVideos(8, activeCategory)
        setVideos(data)
      } catch (error) {
        console.error("Failed to load videos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [activeCategory])

  return (
    <div className="relative min-h-screen bg-gray-100 px-4 py-6 overflow-hidden">

      {/* Snow */}
      <Snowfall
        snowflakeCount={120}
        color="#3b82f6"
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-800"
        >
          Fav-Vid Hub
        </motion.h1>

        {/* Category Selector */}
        <div className="flex gap-3 overflow-x-auto pb-3 mb-6">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium
                whitespace-nowrap transition
                ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 shadow-sm"
                }
              `}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading videos...
          </p>
        )}

        {/* 🚫 EMPTY CATEGORY STATE */}
        {!loading && videos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center mt-28 text-center"
          >
            <p className="text-lg font-semibold text-gray-700">
              No videos in “{activeCategory}”
            </p>
            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              Add your favorite videos to this category by tapping the
              <span className="font-medium text-blue-600"> + </span>
              button below
            </p>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-6 text-blue-600"
            >
              ↓
            </motion.div>
          </motion.div>
        )}

        {/* Video Grid */}
        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/watch/${video.youtubeId}`)}
                className="
                  cursor-pointer
                  bg-white
                  rounded-xl
                  shadow-md
                  hover:shadow-xl
                  transition-shadow
                  overflow-hidden
                "
              >
                <div className="relative group">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>

                {/* <div className="p-4">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">
                    {video.title}
                  </p>
                </div> */}
              </motion.div>
            ))}
          </div>
        )}

        {/* ➕ Floating Add Button */}
        <motion.button
          onClick={() => navigate("/add")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="
            fixed bottom-6 right-6
            bg-blue-600 text-white
            w-14 h-14
            rounded-full
            shadow-lg
            flex items-center justify-center
            z-20
          "
        >
          <Plus />
        </motion.button>

      </div>
    </div>
  )
}
