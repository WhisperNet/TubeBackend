import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Video } from "../models/vidoe.model.js"
import ApiError from "../utils/ApiError.utils.js"
import ApiResponse from "../utils/ApiResponse.utils.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import { uplaodOnCloudinary } from "../utils/cloudinary.utils.js"

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished = true } = req.body
  if (!title || !description) throw new ApiError(400, "Missing required field")
  const videoLocalPath = req.files?.video[0].path
  const thumbnailLocalPath = req.files?.thumbnail[0].path
  const videoResObj = await uplaodOnCloudinary(videoLocalPath)
  const thumbnailResObj = await uplaodOnCloudinary(thumbnailLocalPath)
  if (!videoResObj || !thumbnailResObj)
    throw new ApiError(
      500,
      "Something went wrong while trying to upload video resources"
    )
  const video = await Video.create({
    title,
    description,
    isPublished: Boolean(isPublished),
    videoFile: videoResObj.url,
    videoFileId: videoResObj.public_id,
    duration: videoResObj.duration,
    thumbnail: thumbnailResObj.url,
    thumbnailId: thumbnailResObj.public_id,
    creator: req?.user._id,
    creatorUserName: req.user.username,
  })
  res
    .status(200)
    .json(new ApiResponse(200, video, "Successfully uploaded the video"))
})
const wtachVideo = asyncHandler(async (req, res) => {
  const { id } = req.params
  const video = await Video.findById(id)
  if (!video) throw new ApiError(404, "Video not found")
  if (!video.isPublished) throw new ApiError(400, "Video is private")
  req.user.watchHistory.push(video)
  await req.user.save()
  console.log(await User.findById(req.user._id))
  res.status(200).json(new ApiResponse(200, video))
})
const toggleVideoStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const video = await Video.findById(id)
  if (!video) throw new ApiError(404, "video not found")
  video.isPublished = !video.isPublished
  await video.save()
  res
    .status(200)
    .json(new ApiResponse(200, video, "Successfully updated video status"))
})
const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { title, description } = req.body
  const video = await Video.findByIdAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
    { $set: { title, description } },
    { new: true }
  )
  if (!video) throw new ApiError(404, "Video not found")
  res
    .status(200)
    .json(new ApiResponse(200, video, "Successfully updated the video"))
})
export { uploadVideo, wtachVideo, toggleVideoStatus, updateVideo }
