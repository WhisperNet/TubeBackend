import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.utils.js"
const verifyjwt = async (req, res, next) => {
  const accessToken =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer", "")
  if (!accessToken) throw new ApiError(401, "Unauthorized access")
  try {
    const { id } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(id)
    req.user = user
    next()
  } catch (error) {
    throw new ApiError(401, "Verification error")
  }
}

export { verifyjwt }
