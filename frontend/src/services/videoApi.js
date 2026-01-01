import axios from "axios"

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000"

// Fetch random videos for Home page
export const fetchRandomVideos = async (limit = 8, category = "All") => {
  const query =
    category && category !== "All"
      ? `?limit=${limit}&category=${category}`
      : `?limit=${limit}`

  const res = await axios.get(`${API_BASE}/api/videos/random${query}`)
  return res.data
}

// Fetch related videos for Watch page
export const fetchRelatedVideos = async ({
  category,
  excludeId,
  limit = 6,
}) => {
  const res = await axios.get(
    `${API_BASE}/api/videos/related?category=${category}&excludeId=${excludeId}&limit=${limit}`
  )
  return res.data
}

// ✅ Fetch single video by YouTube ID (FIXES "Video not found")
export const fetchVideoByYoutubeId = async (youtubeId) => {
  const res = await axios.get(`${API_BASE}/api/videos/${youtubeId}`)
  return res.data
}

// Add new video
export const addVideo = async ({ youtubeLink, category }) => {
  const res = await axios.post(`${API_BASE}/api/videos`, {
    youtubeLink,
    category,
  })
  return res.data
}

// Category API functions
export const fetchCategories = async () => {
  const res = await axios.get(`${API_BASE}/api/categories`)
  return res.data
}

export const addCategory = async (name) => {
  const res = await axios.post(`${API_BASE}/api/categories`, { name })
  return res.data
}

export const deleteCategory = async (id) => {
  const res = await axios.delete(`${API_BASE}/api/categories/${id}`)
  return res.data
}
