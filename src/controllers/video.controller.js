import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Video } from "../models/vidoe.model.js"
import ApiError from "../utils/ApiError.utils.js"
import ApiResponse from "../utils/ApiResponse.utils.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import { uplaodOnCloudinary } from "../utils/cloudinary.utils.js"

const getVideos = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = 1,
    user = "",
  } = req.query
  query = query ? `(?i)${query}` : "(?i)"
  const aggregate = Video.aggregate([
    {
      $match: {
        title: {
          $regex: query,
        }, //var of (?i)something or (?i)
      },
    },
    {
      $match: {
        creatorUserName: {
          $regex: user,
        }, // var of username or ""
      },
    },
    {
      $sort: {
        [sortBy]: Number(sortType), //title and 1 both var
      },
    },
  ])
  const options = {
    page, // Current page
    limit, // Results per page
    customLabels: {
      // Optional: Customize labels
      totalDocs: "totalItems",
      docs: "items",
      limit: "perPage",
      page: "currentPage",
      totalPages: "totalPageCount",
    },
  }
  const videos = await Video.aggregatePaginate(aggregate, options)
  if (!videos) res.status(404).json(new ApiError(404, "Nothing found"))
  res.status(200).json(new ApiResponse(200, videos))
})
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
export { uploadVideo, wtachVideo, toggleVideoStatus, updateVideo, getVideos }
