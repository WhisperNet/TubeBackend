import { Router } from "express"
import asyncHandler from "../utils/asyncHandler.utils.js"
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js"
import {
  createPlaylist,
  togglePlaylistVideo,
  updatePlaylist,
  deletPlaylist,
  getPlaylist,
} from "../controllers/playlist.controller.js"
import { playlistAuth } from "../middlewares/playlistAuth.middleware.js"
const router = Router()

router.use(asyncHandler(verifyjwt))
router.route("/").post(createPlaylist)
// router.use(asyncHandler(playlistAuth))
router
  .route("/:id")
  .get(getPlaylist)
  .patch(asyncHandler(playlistAuth), updatePlaylist)
  .delete(asyncHandler(playlistAuth), deletPlaylist)
router
  .route("/:id/v/:videoId")
  .post(asyncHandler(playlistAuth), togglePlaylistVideo)
export default router
