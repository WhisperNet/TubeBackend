import { Playlist } from "../models/playlist.model.js"
import ApiResponse from "../utils/ApiResponse.utils.js"
import ApiError from "../utils/ApiError.utils.js"
import asyncHandler from "../utils/asyncHandler.utils.js"

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body
  const user = req?.user
  if (!name) throw new ApiError(400, "Playlist name can not be blank")
  const playlist = await Playlist.create({
    name,
    description,
    creator: user._id,
  })
  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Successfully created the playlist"))
})
const getPlaylist = asyncHandler(async (req, res) => {
  const { id } = req.params
  const playlist = await Playlist.findById(id).populate("videos")
  if (!playlist) throw new ApiError(404, "Playlist not found")
  res.status(200).json(new ApiResponse(200, playlist))
})
const togglePlaylistVideo = asyncHandler(async (req, res) => {
  const { id, videoId } = req.params
  const { user, playlist } = req
  //Do this if removing a video from a playlist
  let updatedPlaylist = await Playlist.findOneAndUpdate(
    { $and: [{ _id: id }, { videos: videoId }] },
    {
      $pull: { videos: videoId },
    },
    { new: true }
  )
  if (updatedPlaylist)
    return res
      .status(200)
      .json(new ApiResponse(200, updatedPlaylist, "Successfully removed"))
  //DO this if adding a video from playlist
  updatedPlaylist = await Playlist.findByIdAndUpdate(
    id,
    {
      $push: { videos: videoId },
    },
    { new: true }
  )
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Successfully added the video to the playlist"
      )
    )
})
const updatePlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body
  const { playlist } = req
  if (!name) throw new ApiError(400, "Playlist name can not be blank")
  playlist.name = name
  playlist.description = description
  await playlist.save()
  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Successfulyy updated the playlist"))
})
const deletPlaylist = asyncHandler(async (req, res) => {
  await Playlist.findByIdAndDelete(req.playlist._id)
  res
    .status(200)
    .json(new ApiResponse(200, null, "Successfully deleted the playlist"))
})

export {
  createPlaylist,
  togglePlaylistVideo,
  updatePlaylist,
  deletPlaylist,
  getPlaylist,
}
