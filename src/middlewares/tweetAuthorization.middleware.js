import { Tweet } from "../models/tweet.model.js"
import ApiError from "../utils/ApiError.utils.js"
import mongoose from "mongoose"
const tweetAuthorization = async (req, _, next) => {
  const { id } = req.params
  const foundTweet = await Tweet.findById(
    mongoose.Types.ObjectId.createFromHexString(id)
  )
  if (!foundTweet) throw new ApiError(404, "Tweet not found")
  if (foundTweet.creatorname !== req.user.username)
    throw new ApiError(401, "Unauthorized access")
  req.tweet = foundTweet
  next()
}
export { tweetAuthorization }
