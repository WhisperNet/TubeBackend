import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokens,
} from "../controllers/user.controller.js"
const router = Router()

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post(asyncHandler(verifyjwt), logoutUser)
router.route("/refresh-tokens").post(refreshTokens)
export default router
