import { Router } from "express"
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js"
import { tweetAuthorization } from "../middlewares/tweetAuthorization.middleware.js"

const router = Router()
router.use(asyncHandler(verifyjwt))
router.route("/").post(createTweet)
router.route("/user/:username").get(getUserTweets)
router
  .route("/:id")
  .patch(asyncHandler(tweetAuthorization), updateTweet)
  .delete(asyncHandler(tweetAuthorization), deleteTweet)

export default router
