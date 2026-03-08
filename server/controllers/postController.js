import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Add Post
export const addPost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { content, post_type, code_snippets } = req.body;
        const images = req.files

        let image_urls = []

        if(images.length){
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = fs.readFileSync(image.path)
                     const response = await imagekit.upload({
                            file: fileBuffer,
                            fileName: image.originalname,
                            folder: "posts",
                        })

                        const url = imagekit.url({
                            path: response.filePath,
                            transformation: [
                                {quality: 'auto'},
                                { format: 'webp' },
                                { width: '1280' }
                            ]
                        })
                        return url
                })
            )
        }

        const postData = {
            user: userId,
            content,
            image_urls,
            post_type
        }

        // Parse code snippets if provided
        if(code_snippets){
            postData.code_snippets = typeof code_snippets === 'string' ? JSON.parse(code_snippets) : code_snippets
        }

        await Post.create(postData)
        res.json({ success: true, message: "Post created successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Posts
export const getFeedPosts = async (req, res) =>{
    try {
        const { userId } = req.auth()
        const user = await User.findById(userId)

        // User connections and followings 
        const userIds = [userId, ...user.connections, ...user.following]
        const posts = await Post.find({user: {$in: userIds}}).populate('user').sort({createdAt: -1});

        res.json({ success: true, posts})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Like Post
export const likePost = async (req, res) =>{
    try {
        const { userId } = req.auth()
        const { postId } = req.body;

        const post = await Post.findById(postId)

        if(post.likes_count.includes(userId)){
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save()
            res.json({ success: true, message: 'Post unliked' });
        }else{
            post.likes_count.push(userId)
            await post.save()
            res.json({ success: true, message: 'Post liked' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Delete Post
export const deletePost = async (req, res) =>{
    try {
        const { userId } = req.auth()
        const { postId } = req.body;

        const post = await Post.findById(postId)

        if(!post){
            return res.json({ success: false, message: 'Post not found' });
        }

        if(post.user !== userId){
            return res.json({ success: false, message: 'You can only delete your own posts' });
        }

        await Post.findByIdAndDelete(postId)
        res.json({ success: true, message: 'Post deleted successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Edit Post
export const editPost = async (req, res) =>{
    try {
        const { userId } = req.auth()
        const { postId, content, code_snippets } = req.body;
        const images = req.files

        const post = await Post.findById(postId)

        if(!post){
            return res.json({ success: false, message: 'Post not found' });
        }

        if(post.user !== userId){
            return res.json({ success: false, message: 'You can only edit your own posts' });
        }

        let image_urls = post.image_urls

        if(images && images.length > 0){
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = fs.readFileSync(image.path)
                     const response = await imagekit.upload({
                            file: fileBuffer,
                            fileName: image.originalname,
                            folder: "posts",
                        })

                        const url = imagekit.url({
                            path: response.filePath,
                            transformation: [
                                {quality: 'auto'},
                                { format: 'webp' },
                                { width: '1280' }
                            ]
                        })
                        return url
                })
            )
        }

        post.content = content
        post.image_urls = image_urls
        
        // Update code snippets if provided
        if(code_snippets){
            post.code_snippets = typeof code_snippets === 'string' ? JSON.parse(code_snippets) : code_snippets
        }

        await post.save()

        res.json({ success: true, message: 'Post updated successfully', post });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Add Comment
export const addComment = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { postId, content } = req.body

        if(!content || content.trim() === ''){
            return res.json({ success: false, message: 'Comment cannot be empty' });
        }

        const post = await Post.findById(postId).populate('comments.user')

        if(!post){
            return res.json({ success: false, message: 'Post not found' });
        }

        post.comments.push({
            user: userId,
            content
        })

        await post.save()
        await post.populate('comments.user')

        res.json({ success: true, message: 'Comment added successfully', post });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Delete Comment
export const deleteComment = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { postId, commentId } = req.body

        const post = await Post.findById(postId)

        if(!post){
            return res.json({ success: false, message: 'Post not found' });
        }

        const comment = post.comments.id(commentId)

        if(!comment){
            return res.json({ success: false, message: 'Comment not found' });
        }

        if(comment.user !== userId){
            return res.json({ success: false, message: 'You can only delete your own comments' });
        }

        post.comments.id(commentId).deleteOne()
        await post.save()
        await post.populate('comments.user')

        res.json({ success: true, message: 'Comment deleted successfully', post });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}