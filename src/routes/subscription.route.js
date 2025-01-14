import { Router } from "express"
import {
  subscribe,
  unSubscribe,
  getSubscribers,
  getSubscriptions,
} from "../controllers/subscription.controller.js"
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js"
import asyncHandler from "../utils/asyncHandler.utils.js"

const router = Router()
router.route("/:channelName/subscribe").get(asyncHandler(verifyjwt), subscribe)
router
  .route("/:channelName/subscribers")
  .get(asyncHandler(verifyjwt), getSubscribers)
router
  .route("/:channelName/subscriptions")
  .get(asyncHandler(verifyjwt), getSubscriptions)
router
  .route("/:channelName/unsubscribe")
  .get(asyncHandler(verifyjwt), unSubscribe)
export default router
