import { Comment } from "../models/comment.model.js"
import ApiError from "../utils/ApiError.utils.js"
import mongoose from "mongoose"
const commentAuthorization = async (req, _, next) => {
  const { id } = req.params
  const foundComment = await Comment.findById(
    mongoose.Types.ObjectId.createFromHexString(id)
  )
  if (!foundComment) throw new ApiError(404, "Comment not found")
  if (foundComment.creatorname !== req?.user.username)
    throw new ApiError(401, "Unauthorized access")
  req.comment = foundComment
  next()
}
export { commentAuthorization }
