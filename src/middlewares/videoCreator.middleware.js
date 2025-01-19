import { Video } from "../models/vidoe.model.js"
import ApiError from "../utils/ApiError.utils.js"

const videoCreator = async (req, _, next) => {
  const { id } = req.params
  const video = await Video.findById(id)
  if (String(req.user._id) !== String(video.creator))
    throw new ApiError(401, "Not authorized to access this video")
  next()
}

export { videoCreator }
