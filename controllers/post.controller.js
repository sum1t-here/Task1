import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { errorHandler } from '../utils/errorhandler.js';
import Post from '../models/post.model.js';

// zod schema for post creation
const postSchema = z.object({
  content: z.string().max(400),
});

export const createPost = async (req, res, next) => {
  try {
    const postedData = postSchema.parse(req.body);
    const post = new Post({ ...postedData, user: req.user.id });
    await post.save();
    res.send(post);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationError = fromError(err);
      return next(errorHandler(400, validationError.toString()));
    } else {
      return next(err);
    }
  }
};

// Get post by ID
export const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate('user', 'username'); // Populate user details
    res.send(post);
  } catch (err) {
    return next(err);
  }
};

// Get all post
export const getAllPost = async (req, res, next) => {
  try {
    const post = await Post.find();
    res.status(200).json({ post });
  } catch (err) {
    return next(err);
  }
};

// Update post
export const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (post.user.toString() !== req.user.id) {
      return res.status(403).send('You are not authorized to update this post');
    }
    post.set(req.body);
    await post.save();
    res.send(post);
  } catch (err) {
    return next(err);
  }
};

// Delete post
export const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (post.user.toString() !== req.user.id) {
      return res.status(403).send('You are not authorized to delete this post');
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: 'The post was deleted',
    });
  } catch (err) {
    return next(err);
  }
};

// like a post
export const likes = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    post.likes++;
    await post.save();
    res.json({ message: 'Post liked successfully' });
  } catch (err) {
    return next(err);
  }
};

// comment on a post
export const comments = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    const comment = { body: req.body.body, date: new Date(), user: req.user };
    post.comments.push(comment);
    await post.save();
    res.send(comment);
  } catch (err) {
    return next(err);
  }
};
