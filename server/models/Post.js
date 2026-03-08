import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: {type: String, ref: 'User', required: true },
    content: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
})

const codeSnippetSchema = new mongoose.Schema({
    title: {type: String, required: true},
    language: {type: String, required: true},
    code: {type: String, required: true}
})

const postSchema = new mongoose.Schema({
    user: {type: String, ref: 'User', required: true },
    content: {type: String },
    image_urls: [{type: String }],
    post_type: {type: String, enum: ['text', 'image', 'text_with_image'], required: true },
    likes_count: [{type: String, ref: 'User'}],
    comments: [commentSchema],
    code_snippets: [codeSnippetSchema]
}, {timestamps: true, minimize: false})

const Post = mongoose.model('Post', postSchema)

export default Post;