import { User } from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import ApiError from "../utils/ApiError.utils.js"
import ApiResponse from "../utils/ApiResponse.utils.js"
import { uplaodOnCloudinary } from "../utils/cloudinary.utils.js"

const generateAccessAndRefreshToken = async (id) => {
  //   try {
  const user = await User.findById(id)
  const accessToken = await user.generateAccessToken()
  const refreshToken = await user.generateRefreshToken()
  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })
  return { accessToken, refreshToken }
  //   } catch (error) {
  //     throw new ApiError(500, "Error while generating tokens")
  //   }
}
export { generateAccessAndRefreshToken }
