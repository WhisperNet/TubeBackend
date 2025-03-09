import { Comment } from "../models/comment.model.js"
import mongoose from "mongoose"
import { Video } from "../models/vidoe.model.js"
import { Tweet } from "../models/tweet.model.js"
import ApiError from "../utils/ApiError.utils.js"
import ApiResponse from "../utils/ApiResponse.utils.js"
import asyncHandler from "../utils/asyncHandler.utils.js"

const postCommentOnVideo = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { content } = req.body
  const creator = req?.user
  if (!content) throw new ApiError(400, "Comment can not be empty")
  const video = await Video.findById(new mongoose.Types.ObjectId(id))
  if (!video) throw new ApiError(404, "Video not found")
  const comment = await Comment.create({
    content,
    creator,
    video,
    creatorname: creator.username,
  })
  if (!comment)
    throw new ApiError(
      500,
      "something went wrong while trying to post your comment"
    )
  comment.video = comment.video._id
  const responseComment = comment.toObject()
  responseComment.creator = creator?.username || "Anonymous"
  res.status(200).json(new ApiResponse(200, responseComment))
})
const postCommentOnTweet = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { content } = req.body
  const creator = req?.user
  if (!content) throw new ApiError(400, "Comment can not be empty")
  const tweet = await Tweet.findById(new mongoose.Types.ObjectId(id))
  if (!tweet) throw new ApiError(404, "tweet not found")
  const comment = await Comment.create({
    content,
    creator,
    tweet,
    creatorname: creator.username,
  })
  if (!comment)
    throw new ApiError(
      500,
      "something went wrong while trying to post your comment"
    )
  comment.tweet = tweet._id
  const responseComment = comment.toObject()
  responseComment.creator = creator?.username || "Anonymous"
  res.status(200).json(new ApiResponse(200, responseComment))
})
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body
  if (!content) throw new ApiError(400, "comment can not be empty")
  req.comment.content = content
  const updatedComment = await req.comment.save()
  res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated succesfully"))
})
const getCommentOnVideo = asyncHandler(async (req, res) => {
  const { id } = req.params
  const comments = await Comment.find({
    video: new mongoose.Types.ObjectId(id),
  })
  res.status(200).json(new ApiResponse(200, comments))
})
const getCommentOnTweet = asyncHandler(async (req, res) => {
  const { id } = req.params
  const tweetss = await Comment.find({ tweet: new mongoose.Types.ObjectId(id) })
  res.status(200).json(new ApiResponse(200, tweetss))
})
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params
  const result = await Comment.deleteMany({
    _id: new mongoose.Types.ObjectId(id),
  })
  res
    .status(200)
    .json(new ApiResponse(200, null, "Successfully deleted the comment"))
})
export {
  postCommentOnVideo,
  postCommentOnTweet,
  updateComment,
  getCommentOnTweet,
  getCommentOnVideo,
  deleteComment,
}
