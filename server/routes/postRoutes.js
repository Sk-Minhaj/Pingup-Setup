import express from 'express';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';
import { addPost, getFeedPosts, likePost, deletePost, editPost, addComment, deleteComment } from '../controllers/postController.js';

const postRouter = express.Router()

postRouter.post('/add', upload.array('images', 4), protect, addPost)
postRouter.get('/feed', protect, getFeedPosts)
postRouter.post('/like', protect, likePost)
postRouter.post('/delete', protect, deletePost)
postRouter.post('/edit', upload.array('images', 4), protect, editPost)
postRouter.post('/comment/add', protect, addComment)
postRouter.post('/comment/delete', protect, deleteComment)

export default postRouter