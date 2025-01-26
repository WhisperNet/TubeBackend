import { Router } from "express"
import {
  getLikedVidoes,
  toggleLikeOnComment,
  toggleLikeOnTweet,
  toggleLikeOnVideo,
} from "../controllers/like.controller.js"
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js"
import asyncHandler from "../utils/asyncHandler.utils.js"

const router = Router()

router.route("/video/:id").post(asyncHandler(verifyjwt), toggleLikeOnVideo)
router.route("/comment/:id").post(asyncHandler(verifyjwt), toggleLikeOnComment)
router.route("/tweet/:id").post(asyncHandler(verifyjwt), toggleLikeOnTweet)
router.route("/video").get(asyncHandler(verifyjwt), getLikedVidoes)

export default router
