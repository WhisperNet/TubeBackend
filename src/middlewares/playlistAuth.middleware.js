import { Playlist } from "../models/playlist.model.js"
import { Video } from "../models/vidoe.model.js"
import ApiResponse from "../utils/ApiResponse.utils.js"
import ApiError from "../utils/ApiError.utils.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import mongoose from "mongoose"

const playlistAuth = async (req, res, next) => {
  const { id } = req.params
  const playlist = await Playlist.findById(new mongoose.Types.ObjectId(id))
  if (!playlist) throw new ApiError(404, "Playlist not found")
  if (String(req.user._id) !== String(playlist.creator))
    throw new ApiError(400, "Unauthorized access")
  req.playlist = playlist
  next()
}

export { playlistAuth }
