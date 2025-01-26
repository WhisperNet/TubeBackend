import { Like } from "../models/like.model.js"
import ApiResponse from "../utils/ApiResponse.utils.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import mongoose from "mongoose"

const toggleLikeOnVideo = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { user } = req
  const foundLike = await Like.findOneAndDelete({
    video: new mongoose.Types.ObjectId(id),
  })
  if (foundLike)
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Like removed from video"))
  const like = await Like.create({
    likedBy: user._id,
    video: new mongoose.Types.ObjectId(id),
  })
  res.status(200).json(new ApiResponse(200, like, "Liked the video"))
})

const toggleLikeOnTweet = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { user } = req
  const foundLike = await Like.findOneAndDelete({
    tweet: new mongoose.Types.ObjectId(id),
  })
  if (foundLike)
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Like removed from tweet"))
  const like = await Like.create({
    likedBy: user._id,
    tweet: new mongoose.Types.ObjectId(id),
  })
  res.status(200).json(new ApiResponse(200, like, "Liked the tweet"))
})

const toggleLikeOnComment = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { user } = req
  const foundLike = await Like.findOneAndDelete({
    comment: new mongoose.Types.ObjectId(id),
  })
  if (foundLike)
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Like removed from comment"))
  const like = await Like.create({
    likedBy: user._id,
    comment: new mongoose.Types.ObjectId(id),
  })
  res.status(200).json(new ApiResponse(200, like, "Liked the comment"))
})
const getLikedVidoes = asyncHandler(async (req, res) => {
  const videos = await Like.aggregate([
    {
      $match: {
        likedBy: req?.user._id,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $addFields: {
        video: {
          $arrayElemAt: ["$video", 0],
        },
      },
    },
    {
      $project: {
        video: 1,
        _id: 0,
      },
    },
  ])
  res.status(200).json(new ApiResponse(200, videos))
})
export {
  toggleLikeOnVideo,
  toggleLikeOnComment,
  toggleLikeOnTweet,
  getLikedVidoes,
}
