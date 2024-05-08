import { Schema, model } from 'mongoose';

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        body: String,
        date: Date,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }, // Reference to User model
  },
  { timestamps: true }
);

const Post = model('Post', postSchema);
export default Post;
