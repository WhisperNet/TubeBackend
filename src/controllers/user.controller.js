import { User } from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import ApiError from "../utils/ApiError.utils.js"
import ApiResponse from "../utils/ApiResponse.utils.js"
import { uplaodOnCloudinary } from "../utils/cloudinary.utils.js"
import { generateAccessAndRefreshToken } from "../utils/generateTokens.utils.js"
import jwt from "jsonwebtoken"
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body
  if (
    [username, email, fullName, password].some(
      (elm) => !elm || elm?.trim() === ""
    )
  ) {
    throw new ApiError(400, "Missing data fields")
  }
  const userExist = await User.findOne({ $or: [{ username }, { email }] })
  if (userExist) {
    throw new ApiError(400, "User or Email already exist")
  }
  const avatarLocal = req.files?.avatar ? req.files.avatar[0]?.path : null
  const coverImageLocal = req.files?.coverImage
    ? req.files.coverImage[0]?.path
    : null
  const { url: avatar } = await uplaodOnCloudinary(avatarLocal)
  const { url: coverImage } = await uplaodOnCloudinary(coverImageLocal)
  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    fullName,
    password,
    avatar: avatar ? avatar : undefined,
    coverImage: coverImage ? coverImage : undefined,
  })
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating new user")
  }
  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "Successfully created the user"))
})

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body
  console.log(username, email, password)
  if (!username && !email) {
    throw new ApiError(401, "Missing required data fields")
  }
  const user = await User.findOne({ $or: [{ username }, { email }] }).select(
    "-refreshToken"
  )
  if (!user) throw new ApiError(401, "Invalid user info")
  const isPasswordCorrect = await user.isPasswordCorrect(password)
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid user credentials")
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  )
  const options = {
    httpOnly: true,
    secure: true,
  }
  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "Login successfull"
      )
    )
})
const logoutUser = asyncHandler(async (req, res) => {
  req.user.refreshToken = undefined
  await req.user.save()
  res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "Logout Successfully"))
})
const refreshTokens = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshTokens
  if (!refreshToken) throw new ApiError(401, "Unauthorized Access")
  try {
    const { id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(id)
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id)
    user.refreshToken = newRefreshToken
    await user.save()
    const options = {
      httpOnly: true,
      secure: true,
    }
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { refreshToken: newRefreshToken, accessToken },
          "Tokens refreshed"
        )
      )
  } catch (error) {
    console.log(error)
  }
})
export { registerUser, loginUser, logoutUser, refreshTokens }
