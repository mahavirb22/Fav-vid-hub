import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Snowfall from "react-snowfall"
import {
  fetchRelatedVideos,
  fetchVideoByYoutubeId,
} from "../services/videoApi"
import { ArrowLeft } from "lucide-react"

export default function Watch() {
  const { youtubeId } = useParams()
  const navigate = useNavigate()

  const [currentVideo, setCurrentVideo] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!youtubeId) return

    const loadVideo = async () => {
      try {
        setLoading(true)

        const video = await fetchVideoByYoutubeId(youtubeId)
        setCurrentVideo(video)

        const related = await fetchRelatedVideos({
          category: video.category.name,
          excludeId: video.youtubeId,
        })

        setRelatedVideos(related)
      } catch (error) {
        console.error("Failed to load watch page data", error)
        setCurrentVideo(null)
      } finally {
        setLoading(false)
      }
    }

    loadVideo()
  }, [youtubeId])

  return (
    <div className="relative min-h-screen bg-gray-100 px-4 py-6 overflow-hidden">

      {/* Snow */}
      <Snowfall
        snowflakeCount={100}
        color="#3b82f6"
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">

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

        {loading && (
          <p className="text-center text-gray-500">
            Loading video...
          </p>
        )}

        {!loading && !currentVideo && (
          <p className="text-center text-gray-600">
            Video not found
          </p>
        )}

        {!loading && currentVideo && (
          <>
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-md">
              <iframe
                className="w-full h-full"
                // ⭐ ADDED &autoplay=1 HERE ⭐
                src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?rel=0&modestbranding=1&autoplay=1`}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              {currentVideo.title}
            </h2>

            {relatedVideos.length > 0 && (
              <>
                <h3 className="mt-8 mb-4 text-base font-semibold text-gray-700">
                  Related Videos
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedVideos.map(video => (
                    <motion.div
                      key={video._id}
                      whileHover={{ y: -4 }}
                      onClick={() =>
                        navigate(`/watch/${video.youtubeId}`)
                      }
                      className="
                        cursor-pointer
                        bg-white
                        rounded-xl
                        shadow-md
                        hover:shadow-lg
                        transition
                        overflow-hidden
                      "
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        loading="lazy"
                        className="h-32 w-full object-cover"
                      />
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">
                          {video.title}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}