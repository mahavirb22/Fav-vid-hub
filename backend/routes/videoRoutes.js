import express from "express"
import {
  addVideo,
  getAllVideos,
  getRandomVideos,
  getRelatedVideos,
  getVideoByYoutubeId,
} from "../controllers/videoController.js"

const router = express.Router()

// Add new video
router.post("/", addVideo)

// Get related videos by category
router.get("/related", getRelatedVideos)

// Get random videos (home page)
router.get("/random", getRandomVideos)

// Get single video by YouTube ID (watch page)
router.get("/:youtubeId", getVideoByYoutubeId)

// Get all videos (fallback / admin / debug)
router.get("/", getAllVideos)

export default router
