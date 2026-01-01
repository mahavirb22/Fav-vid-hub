import connectDB from "../_db.js"
import Video from "../Video.js"
import Category from "../Category.js"
import { extractYouTubeId, getThumbnailFromId } from "../youtube.js"
import fetch from "node-fetch"

export default async function handler(req, res) {
  await connectDB()

  if (req.method === "POST") {
    // Add new video
    try {
      const { youtubeLink, category: categoryName } = req.body

      if (!youtubeLink || !categoryName) {
        return res.status(400).json({
          message: "YouTube link and category are required",
        })
      }

      const youtubeId = extractYouTubeId(youtubeLink)

      if (!youtubeId) {
        return res.status(400).json({
          message: "Invalid YouTube link",
        })
      }

      const existingVideo = await Video.findOne({ youtubeId })
      if (existingVideo) {
        return res.status(409).json({
          message: "Video already exists",
        })
      }

      // Find or create category
      let category = await Category.findOne({
        name: { $regex: new RegExp(`^${categoryName.trim()}$`, "i") },
      })

      if (!category) {
        category = await Category.create({
          name: categoryName.trim(),
        })
      }

      // Fetch title from YouTube
      let videoTitle = "Untitled Video"

      try {
        const ytRes = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
        )

        if (ytRes.ok) {
          const ytData = await ytRes.json()
          videoTitle = ytData.title
        }
      } catch (err) {
        console.warn("YouTube title fetch failed")
      }

      const video = await Video.create({
        youtubeId,
        title: videoTitle,
        category: category._id,
        thumbnail: getThumbnailFromId(youtubeId),
      })

      res.status(201).json(video)
    } catch (error) {
      res.status(500).json({
        message: "Failed to add video",
        error: error.message,
      })
    }
  } else if (req.method === "GET") {
    // Get all videos
    try {
      const videos = await Video.find()
        .populate("category")
        .sort({ createdAt: -1 })
      res.json(videos)
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch videos",
      })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}