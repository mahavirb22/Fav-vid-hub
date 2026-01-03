import Video from "../models/Video.js"
import Category from "../models/Category.js"
import {
  extractYouTubeId,
  getThumbnailFromId,
} from "../utils/youtube.js"

/**
 * @desc Add new video
 */
export const addVideo = async (req, res) => {
  try {
    const { youtubeLink, category: categoryName } = req.body

    if (!youtubeLink || !categoryName) {
      return res.status(400).json({ message: "YouTube link and category are required" })
    }

    const youtubeId = extractYouTubeId(youtubeLink)
    if (!youtubeId) {
      return res.status(400).json({ message: "Invalid YouTube link" })
    }

    const existing = await Video.findOne({ youtubeId })
    if (existing) {
      return res.status(409).json({ message: "Video already exists" })
    }

    const safeName = escapeRegex(categoryName.trim())

    let category = await Category.findOne({
      name: { $regex: new RegExp(`^${safeName}$`, "i") },
    })

    if (!category) {
      category = await Category.create({ name: categoryName.trim() })
    }

    // Use global fetch (Vercel Node 18+)
    let title = "Untitled Video"
    try {
      const r = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
      )
      if (r.ok) {
        const data = await r.json()
        title = data.title
      }
    } catch {
      console.warn("YouTube title fetch failed")
    }

    const video = await Video.create({
      youtubeId,
      title,
      category: category._id,
      thumbnail: getThumbnailFromId(youtubeId),
    })

    res.status(201).json(video)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to add video" })
  }
}

/**
 * @desc Get all videos
 */
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("category")
      .sort({ createdAt: -1 })
    res.json(videos)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch videos" })
  }
}

/**
 * @desc Get random videos
 */
export const getRandomVideos = async (req, res) => {
  try {
    const limit = Math.max(Number(req.query.limit) || 8, 1)
    const categoryName = req.query.category

    let matchStage = {}

    if (categoryName && categoryName !== "All") {
      const safeName = escapeRegex(categoryName)
      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${safeName}$`, "i") },
      })
      if (category) {
        matchStage.category = category._id
      }
    }

    const videos = await Video.aggregate([
      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
      { $sample: { size: limit } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    ])

    res.json(videos)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch videos" })
  }
}

/**
 * @desc Get related videos
 */
export const getRelatedVideos = async (req, res) => {
  try {
    const { category, excludeId } = req.query
    const limit = Number(req.query.limit) || 6

    // Agar category hi nahi aayi → empty list
    if (!category) {
      return res.json([])
    }

    // Category find karo (safe)
    const foundCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${category}$`, "i") }
    })

    // Agar category DB me nahi mili → empty list
    if (!foundCategory) {
      return res.json([])
    }

    const videos = await Video.find({
      category: foundCategory._id,
      ...(excludeId ? { youtubeId: { $ne: excludeId } } : {})
    })
      .limit(limit)
      .populate("category")

    return res.json(videos)
  } catch (error) {
    console.error("Related videos error:", error)
    return res.status(500).json({
      message: "Failed to fetch related videos"
    })
  }
}

/**
 * @desc Get video by YouTube ID
 */
export const getVideoByYoutubeId = async (req, res) => {
  try {
    const video = await Video.findOne({ youtubeId: req.params.youtubeId })
      .populate("category")

    if (!video) {
      return res.status(404).json({ message: "Video not found" })
    }

    res.json(video)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch video" })
  }
}
