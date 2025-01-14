import { Subscription } from "../models/subscription.model.js"
import { User } from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import ApiError from "../utils/ApiError.utils.js"
import ApiResponse from "../utils/ApiResponse.utils.js"
const subscribe = asyncHandler(async (req, res) => {
  const { channelName } = req.params
  if (!channelName?.trim()) throw new ApiError(400, "Channel name missing")
  const channel = await User.findOne({ username: channelName })
  if (!channel) throw new ApiError(404, "Channel not found")
  const isSubsribed = await Subscription.findOne({
    $and: [{ channel: channel._id }, { subscriber: req.user._id }],
  })
  if (isSubsribed) throw new ApiError(400, "Already subscribed to this channel")
  const subscription = await Subscription.create({
    subscriber: req.user._id,
    channel: channel._id,
  })
  if (!subscription)
    throw new ApiError(
      500,
      "Something went wrong while subscribing to the channel "
    )
  res
    .status(200)
    .json(new ApiResponse(200, subscription, "Subscribed successfully"))
})
const getSubscribers = asyncHandler(async (req, res) => {
  const { channelName } = req.params
  const channel = await User.findOne({ username: channelName })
  if (!channel) throw new ApiError(200, "Channel not found")
  if (req.user.username !== channelName)
    throw new ApiError(401, "Unauthorized Access To Channel's Subscribers")
  const subscriberData = await Subscription.aggregate([
    {
      $match: {
        channel: channel._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
              coverImage: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        subscriber: 1,
      },
    },
  ])
  if (!subscriberData?.length)
    res.status(200).json(new ApiResponse(200, [], "Subscriber Data Fetched"))
  else
    res
      .status(200)
      .json(new ApiResponse(200, subscriberData, "Subscriber Data Fetched"))
})
const getSubscriptions = asyncHandler(async (req, res) => {
  const { channelName } = req.params
  const channel = await User.findOne({ username: channelName })
  if (!channel) throw new ApiError(200, "Channel not found")
  if (!channel.isSubscriptionsPublic && req.user.username !== channelName)
    throw new ApiError(401, "This Channel's subscription is private")
  const subscriptionData = await Subscription.aggregate([
    {
      $match: {
        subscriber: channel._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscription",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
              coverImage: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        subscription: 1,
      },
    },
  ])
  if (!subscriptionData?.length)
    res.status(200).json(new ApiResponse(200, [], "Subscription Data Fetched"))
  else
    res
      .status(200)
      .json(new ApiResponse(200, subscriptionData, "Subscription Data Fetched"))
})
const unSubscribe = asyncHandler(async (req, res) => {
  const { channelName } = req.params
  const channel = await User.findOne({ username: channelName })
  if (!channel) throw new ApiError(404, "Channel not found")
  const unSubscribeChannel = await Subscription.findOneAndDelete({
    $and: [{ subscriber: req?.user?._id }, { channel: channel._id }],
  })
  res
    .status(200)
    .json(new ApiResponse(200, null, "Unsubscribed from the channel"))
})
export { subscribe, getSubscribers, getSubscriptions, unSubscribe }
