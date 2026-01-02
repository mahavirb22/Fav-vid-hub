import axios from "axios"

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  if (import.meta.env.PROD) {
    // Fail loudly in production so misconfiguration doesn't cause requests to hit the frontend domain
    throw new Error(
      'VITE_API_BASE_URL is not set. Set it to your backend origin including the /api prefix, e.g. "https://your-backend.vercel.app/api"'
    )
  } else {
    // In development, warn (instead of throwing) so dev workflow isn't blocked; developers should set a local env var
    // Example local value: "http://localhost:5000/api"
    // Note: no runtime fallback is used; this is only a developer convenience message
    // to remind the developer to set the build-time env var.
    // eslint-disable-next-line no-console
    console.warn(
      'VITE_API_BASE_URL is not set. Add it to your local env (e.g., .env.local) pointing at your backend (example: "http://localhost:5000/api").'
    )
  }
}

const api = axios.create({
  baseURL,
})

// Fetch random videos for Home page
export const fetchRandomVideos = async (limit = 8, category = "All") => {
  const query =
    category && category !== "All"
      ? `?limit=${limit}&category=${category}`
      : `?limit=${limit}`

  const res = await api.get(`/videos/random${query}`)
  return res.data
} 

// Fetch related videos for Watch page
export const fetchRelatedVideos = async ({
  category,
  excludeId,
  limit = 6,
}) => {
  const res = await api.get(
    `/videos/related?category=${encodeURIComponent(
      category
    )}&excludeId=${encodeURIComponent(excludeId)}&limit=${limit}`
  )
  return res.data
} 

// Fetch single video by YouTube ID
export const fetchVideoByYoutubeId = async (youtubeId) => {
  const res = await api.get(`/videos/${encodeURIComponent(youtubeId)}`)
  return res.data
} 

// Add new video
export const addVideo = async ({ youtubeLink, category }) => {
  const res = await api.post(`/videos`, {
    youtubeLink,
    category,
  })
  return res.data
} 

// Category API functions
export const fetchCategories = async () => {
  const res = await api.get(`/categories`)
  return res.data
} 

export const addCategory = async (name) => {
  const res = await api.post(`/categories`, { name })
  return res.data
} 

export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${encodeURIComponent(id)}`)
  return res.data
}

export default api
