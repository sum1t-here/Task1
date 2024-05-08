import { Router } from 'express';
import {
  comments,
  createPost,
  deletePost,
  getAllPost,
  getPost,
  likes,
  updatePost,
} from '../controllers/post.controller.js';
import authenticateToken from '../utils/authentication.js';

const router = Router();

router.post('/create', authenticateToken, createPost);
router.get('/get-post/:id', getPost);
router.get('/get-all-post', getAllPost);
router.put('/update-post/:id', authenticateToken, updatePost);
router.delete('/delete-post/:id', authenticateToken, deletePost);
router.post('/like-post/:id', likes);
router.post('/comment/:id', comments);
export default router;
