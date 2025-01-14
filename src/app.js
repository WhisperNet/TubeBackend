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
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/c/", subscriptionRoutes)
export default app
