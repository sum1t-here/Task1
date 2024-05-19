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
router.get('/get-post/:id', authenticateToken, getPost);
router.get('/get-all-post', authenticateToken, getAllPost);
router.put('/update-post/:id', authenticateToken, updatePost);
router.delete('/delete-post/:id', authenticateToken, deletePost);
router.post('/like-post/:id', authenticateToken, likes);
router.post('/comment/:id', authenticateToken, comments);
export default router;
