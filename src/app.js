import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app = express()

app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
)
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

import userRoutes from "./routes/user.route.js"
import subscriptionRoutes from "./routes/subscription.route.js"
import videoRoutes from "./routes/video.route.js"
import tweetRoutes from "./routes/tweet.router.js"
import commentRoutes from "./routes/comment.router.js"
import likeRoutes from "./routes/like.route.js"
import playlistRoutes from "./routes/playlist.routes.js"
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/c", subscriptionRoutes)
app.use("/api/v1/video", videoRoutes)
app.use("/api/v1/tweet", tweetRoutes)
app.use("/api/v1/comment", commentRoutes)
app.use("/api/v1/like", likeRoutes)
app.use("/api/v1/playlist", playlistRoutes)
export default app
