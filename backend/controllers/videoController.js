import Video from "../models/Video.js"
import Category from "../models/Category.js"
import {
  extractYouTubeId,
  getThumbnailFromId,
} from "../utils/youtube.js"
import fetch from "node-fetch"

/**
 * @desc    Add new video
 * @route   POST /api/videos
 */
export const addVideo = async (req, res) => {
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

    // 🔹 Fetch title from YouTube (no API key)
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
}

/**
 * @desc    Get all videos
 * @route   GET /api/videos
 */
export const getAllVideos = async (req, res) => {
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
}

// controllers/videoController.js
export const getRandomVideos = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8
    const { category: categoryName } = req.query

    const pipeline = []

    if (categoryName && categoryName !== "All") {
      // Find category by name
      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${categoryName}$`, "i") },
      })
      if (category) {
        pipeline.push({ $match: { category: category._id } })
      }
    }

    pipeline.push({ $sample: { size: limit } })

    const videos = await Video.aggregate(pipeline).then(async (videos) => {
      // Populate categories
      const categoryIds = videos.map(v => v.category)
      const categories = await Category.find({ _id: { $in: categoryIds } })
      const categoryMap = categories.reduce((map, cat) => {
        map[cat._id.toString()] = cat
        return map
      }, {})

      return videos.map(video => ({
        ...video,
        category: categoryMap[video.category.toString()],
      }))
    })

    res.json(videos)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch videos",
      error: error.message,
    })
  }
}


/**
 * @desc    Get related videos by category
 * @route   GET /api/videos/related
 */
export const getRelatedVideos = async (req, res) => {
  try {
    const { category: categoryName, excludeId } = req.query
    const limit = Number(req.query.limit) || 6

    if (!categoryName) {
      return res.status(400).json({
        message: "Category is required",
      })
    }

    // Find category by name
    const category = await Category.findOne({
      name: { $regex: new RegExp(`^${categoryName}$`, "i") },
    })

    if (!category) {
      return res.json([])
    }

    const query = { category: category._id }

    if (excludeId) {
      query.youtubeId = { $ne: excludeId }
    }

    const videos = await Video.find(query)
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(limit)

    res.json(videos)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch related videos",
      error: error.message,
    })
  }
}

/**
 * @desc    Get single video by YouTube ID
 * @route   GET /api/videos/:youtubeId
 */
export const getVideoByYoutubeId = async (req, res) => {
  try {
    const { youtubeId } = req.params

    const video = await Video.findOne({ youtubeId }).populate("category")

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      })
    }

    res.json(video)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch video",
    })
  }
}
