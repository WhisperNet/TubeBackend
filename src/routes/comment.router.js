import { Router } from "express"
import asyncHandler from "../utils/asyncHandler.utils.js"
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js"
import { commentAuthorization } from "../middlewares/commentAuthorization.middleware.js"
import {
  postCommentOnVideo,
  postCommentOnTweet,
  updateComment,
} from "../controllers/comment.controller.js "
const router = Router()

router.use(asyncHandler(verifyjwt))
router.route("/video/:id").post(postCommentOnVideo)
router.route("/tweet/:id").post(postCommentOnTweet)
router.route("/:id").patch(asyncHandler(commentAuthorization), updateComment)

export default router
