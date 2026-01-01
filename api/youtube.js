export const extractYouTubeId = (url) => {
  if (!url) return null

  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,        // normal
    /youtube\.com\/embed\/([^?]+)/,          // embed
    /youtu\.be\/([^?]+)/,                    // short url
    /youtube\.com\/shorts\/([^?]+)/,         // shorts
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1].substring(0, 11)
    }
  }

  return null
}

export const getThumbnailFromId = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}