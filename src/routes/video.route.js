import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import {
  toggleVideoStatus,
  updateVideo,
  uploadVideo,
  wtachVideo,
  getVideos,
} from "../controllers/video.controller.js"
import { videoCreator } from "../middlewares/videoCreator.middleware.js"
const router = Router()

router.use(asyncHandler(verifyjwt))
router
  .route("/")
  .post(
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    uploadVideo
  )
  .get(getVideos)
router
  .route("/:id")
  .get(wtachVideo)
  .patch(asyncHandler(videoCreator), updateVideo)
router
  .route("/:id/video-status")
  .patch(asyncHandler(videoCreator), toggleVideoStatus)

export default router
