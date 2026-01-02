import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Fetch random videos for Home page
export const fetchRandomVideos = async (limit = 8, category = "All") => {
  const query =
    category && category !== "All"
      ? `?limit=${limit}&category=${category}`
      : `?limit=${limit}`

  const res = await api.get(`/api/videos/random${query}`)
  return res.data
}

// Fetch related videos for Watch page
export const fetchRelatedVideos = async ({
  category,
  excludeId,
  limit = 6,
}) => {
  const res = await api.get(
    `/api/videos/related?category=${encodeURIComponent(
      category
    )}&excludeId=${encodeURIComponent(excludeId)}&limit=${limit}`
  )
  return res.data
}

// Fetch single video by YouTube ID
export const fetchVideoByYoutubeId = async (youtubeId) => {
  const res = await api.get(`/api/videos/${encodeURIComponent(youtubeId)}`)
  return res.data
}

// Add new video
export const addVideo = async ({ youtubeLink, category }) => {
  const res = await api.post(`/api/videos`, {
    youtubeLink,
    category,
  })
  return res.data
}

// Category API functions
export const fetchCategories = async () => {
  const res = await api.get(`/api/categories`)
  return res.data
}

export const addCategory = async (name) => {
  const res = await api.post(`/api/categories`, { name })
  return res.data
}

export const deleteCategory = async (id) => {
  const res = await api.delete(`/api/categories/${encodeURIComponent(id)}`)
  return res.data
}

export default api
