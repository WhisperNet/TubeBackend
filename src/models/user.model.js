import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "/picture/avatar.png",
    },
    avatarId: {
      type: String,
    },
    coverImage: {
      type: String,
      default: "/picture/cover.png",
    },
    coverImageId: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    isSubscriptionsPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12)
  }
  next()
})
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    }
  )
}
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    }
  )
}
const User = mongoose.model("User", userSchema)
export { User }
