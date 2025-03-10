import { Router } from "express"
import asyncHandler from "../utils/asyncHandler.utils.js"
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js"
import { commentAuthorization } from "../middlewares/commentAuthorization.middleware.js"
import {
  postCommentOnVideo,
  postCommentOnTweet,
  updateComment,
  getCommentOnTweet,
  getCommentOnVideo,
  deleteComment,
} from "../controllers/comment.controller.js "
const router = Router()

router.use(asyncHandler(verifyjwt))
router.route("/video/:id").post(postCommentOnVideo).get(getCommentOnVideo)
router.route("/tweet/:id").post(postCommentOnTweet).get(getCommentOnTweet)
router
  .route("/:id")
  .patch(asyncHandler(commentAuthorization), updateComment)
  .delete(asyncHandler(commentAuthorization), deleteComment)

export default router
