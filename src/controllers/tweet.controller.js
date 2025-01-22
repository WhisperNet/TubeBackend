import { Tweet } from "../models/tweet.model.js"
import ApiError from "../utils/ApiError.utils.js"
import ApiResponse from "../utils/ApiResponse.utils.js"
import asyncHandler from "../utils/asyncHandler.utils.js"

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body
  if (!content) throw new ApiError(400, "Missing tweet")
  const tweet = await Tweet.create({
    content,
    creator: req?.user,
    creatorname: req?.user.username,
  })
  tweet.creator = tweet.creator._id
  if (!tweet)
    throw new ApiError(
      500,
      "Something went wrong while trying to post your tweet"
    )
  res.status(200).json(new ApiResponse(200, tweet))
})
const getUserTweets = asyncHandler(async (req, res) => {
  const { username } = req.params
  const tweets = await Tweet.find({ creatorname: username })
  res.status(200).json(new ApiResponse(200, tweets))
})
const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body
  if (!content) throw new ApiError(400, "Tweet cann't be empty")
  req.tweet.content = content
  const updateTweet = await req.tweet.save()
  res
    .status(200)
    .json(new ApiResponse(200, updateTweet, "Successfully updated the tweet"))
})
export { createTweet, getUserTweets, updateTweet }
