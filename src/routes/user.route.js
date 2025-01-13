import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokens,
  updateUserProfile,
  updateAvatar,
  updateCoverImage,
  updatePassword,
  getUserProfile,
  getCurrentUser,
} from "../controllers/user.controller.js"
const router = Router()

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
)
//
router.route("/login").post(loginUser)
router.route("/logout").post(asyncHandler(verifyjwt), logoutUser)
router.route("/refresh-tokens").post(refreshTokens)
router.route("/").get(asyncHandler(verifyjwt), getCurrentUser)
router
  .route("/update-user-profile")
  .patch(asyncHandler(verifyjwt), updateUserProfile)
router
  .route("/update-avatar")
  .patch(asyncHandler(verifyjwt), upload.single("avatar"), updateAvatar)
router
  .route("/update-coverimage")
  .patch(asyncHandler(verifyjwt), upload.single("coverImage"), updateCoverImage)
router.route("/update-password").patch(asyncHandler(verifyjwt), updatePassword)
router.route("/c/:channel").get(asyncHandler(verifyjwt), getUserProfile)
export default router
