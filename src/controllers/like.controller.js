import { Like } from "../models/like.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Video } from "../models/vidoe.model.js"
import { Comment } from "../models/comment.model.js"
import ApiError from "../utils/ApiError.utils.js"
import ApiResponse from "../utils/ApiResponse.utils.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import mongoose from "mongoose"

const toggleLikeOnVideo = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { user } = req
  const foundLike = await Like.findOneAndDelete({
    $and: [{ video: new mongoose.Types.ObjectId(id) }, { likedBy: user._id }],
  })
  if (foundLike)
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Like removed from video"))
  const video = await Video.findById(new mongoose.Types.ObjectId(id))
  if (!video) throw new ApiError(404, "Video Not Found")
  const like = await Like.create({
    likedBy: user._id,
    video: video._id,
  })
  res.status(200).json(new ApiResponse(200, like, "Liked the video"))
})

const toggleLikeOnTweet = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { user } = req
  const foundLike = await Like.findOneAndDelete({
    $and: [{ tweet: new mongoose.Types.ObjectId(id) }, { likedBy: user._id }],
  })
  if (foundLike)
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Like removed from tweet"))
  const tweet = await Tweet.findById(new mongoose.Types.ObjectId(id))
  if (!tweet) throw new ApiError(404, "Tweet not found")
  const like = await Like.create({
    likedBy: user._id,
    tweet: tweet._id,
  })
  res.status(200).json(new ApiResponse(200, like, "Liked the tweet"))
})

const toggleLikeOnComment = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { user } = req
  const foundLike = await Like.findOneAndDelete({
    $and: [{ comment: new mongoose.Types.ObjectId(id) }, { likedBy: user._id }],
  })
  if (foundLike)
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Like removed from comment"))
  const comment = await Comment.findById(new mongoose.Types.ObjectId(id))
  if (!comment) throw new ApiError(404, "Comment not found")
  const like = await Like.create({
    likedBy: user._id,
    comment: comment._id,
  })
  res.status(200).json(new ApiResponse(200, like, "Liked the comment"))
})
const getLikedVidoes = asyncHandler(async (req, res) => {
  const videos = await Like.aggregate([
    {
      $match: {
        likedBy: req?.user._id,
        video: { $exists: true },
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
