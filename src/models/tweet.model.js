import mongoose, { Schema } from "mongoose"
import { Comment } from "./comment.model.js"
import { Like } from "./like.model.js"
const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    creatorname: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)
tweetSchema.pre("deleteMany", async function (next) {
  const tweet = this.getQuery()._id
  if (tweet) {
    const result = await Comment.deleteMany({
      tweet: { $in: tweet },
    })
    console.log("Triggered the hook in tweet for deleting comment\n", result)
    const res = await Like.deleteMany({ tweet: { $in: tweet } })
    console.log("Triggered the hook in tweet for deleting Like\n", res)
  }
  next()
})
export const Tweet = new mongoose.model("Tweet", tweetSchema)
