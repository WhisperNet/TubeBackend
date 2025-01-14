import { User } from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import ApiError from "../utils/ApiError.utils.js"
import ApiResponse from "../utils/ApiResponse.utils.js"
import {
  uplaodOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.utils.js"
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
  const avatarObj = await uplaodOnCloudinary(avatarLocal)
  const coverObj = await uplaodOnCloudinary(coverImageLocal)

  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    fullName,
    password,
    avatar: avatarObj ? avatarObj.url : undefined,
    coverImage: coverObj ? coverObj.url : undefined,
    avatarId: avatarObj ? avatarObj.public_id : undefined,
    coverImageId: coverObj ? coverObj.public_id : undefined,
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
const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req?.user, "Current User Data"))
})
const updateUserProfile = asyncHandler(async (req, res) => {
  const { email, fullName } = req.body
  if (!email.trim() && !fullName.trim())
    throw new ApiError(400, "Email and full name is required")
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken")
  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User Profile updated"))
})
const updateAvatar = asyncHandler(async (req, res) => {
  const localUri = req.file?.path
  if (!localUri) throw new ApiError(400, "Avatar image missing")
  const { url, public_id } = await uplaodOnCloudinary(localUri)
  if (!url)
    throw new ApiError(
      500,
      "Something went wrong while trying to upload the file"
    )
  await deleteFromCloudinary(req.user.avatarId)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: url, avatarId: public_id } },
    { new: true }
  )
  res
    .status(200)
    .json(new ApiResponse(200, user.avatar, "Avatar updated successfully"))
})
const updateCoverImage = asyncHandler(async (req, res) => {
  const localUri = req.file?.path
  if (!localUri) throw new ApiError(400, "Cover image missing")
  const { url, public_id } = await uplaodOnCloudinary(localUri)
  if (!url)
    throw new ApiError(
      500,
      "Something went wrong while trying to upload the file"
    )
  await deleteFromCloudinary(req.user.coverImageId)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { coverImage: url, coverImageId: public_id } },
    { new: true }
  )
  res
    .status(200)
    .json(
      new ApiResponse(200, user.coverImage, "Cover Image updated successfully")
    )
})
const updatePassword = asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body
  if (!password.trim() || !newPassword.trim())
    throw new ApiError(400, "Missing required field")
  const isPasswordCorrect = await req.user.isPasswordCorrect(password)
  if (!isPasswordCorrect) throw new ApiError(400, "Incorrect Password")
  req.user.password = newPassword
  await req.user.save()
  res
    .status(200)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(
      new ApiResponse(200, { success: true }, "Password updated successfully")
    )
})
// ToDo : Testing when video data is available
const getUserProfile = asyncHandler(async (req, res) => {
  const { channel } = req.params
  if (!channel?.trim()) throw new ApiError(400, "Channel name is missing")
  const userProfile = await User.aggregate([
    {
      $match: {
        username: channel,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribersList",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscriberToList",
      },
    },
    {
      $addFields: {
        subscribers: { $size: "$subscribersList" },
        subscriberTo: { $size: "$subscriberToList" },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user._id, "$subscribersList.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        avatar: 1,
        coverImage: 1,
        fullName: 1,
        username: 1,
        subscribers: 1,
        subscriberTo: 1,
        isSubscribed: 1,
      },
    },
  ])
  if (!userProfile) throw new ApiError(404, "Channel not found")
  res.status(200).json(new ApiResponse(200, userProfile, "Channel found"))
})
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokens,
  getCurrentUser,
  updateUserProfile,
  updateAvatar,
  updateCoverImage,
  updatePassword,
  getUserProfile,
}
