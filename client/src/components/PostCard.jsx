import React, { useState } from 'react'
import { BadgeCheck, Heart, MessageCircle, Share2, MoreVertical, Send, Trash2 } from 'lucide-react'
import moment from 'moment'
import { dummyUserData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import EditPostModal from './EditPostModal'

const PostCard = ({post: initialPost}) => {

    const postWithHashtags = initialPost.content.replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>')
    const [likes, setLikes] = useState(initialPost.likes_count)
    const [post, setPost] = useState(initialPost)
    const [showComments, setShowComments] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [isSubmittingComment, setIsSubmittingComment] = useState(false)
    const currentUser = useSelector((state) => state.user.value)

    const { getToken } = useAuth()

    const handleLike = async () => {
        try {
            const { data } = await api.post(`/api/post/like`, {postId: post._id}, {headers: { Authorization: `Bearer ${await getToken()}` }})

            if (data.success){
               toast.success(data.message) 
               setLikes(prev =>{
                if(prev.includes(currentUser._id)){
                    return prev.filter(id=> id !== currentUser._id)
                }else{
                    return [...prev, currentUser._id]
                }
               })
            }else{
                toast(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if(!commentText.trim()){
            toast.error('Comment cannot be empty')
            return
        }

        setIsSubmittingComment(true)
        try {
            const { data } = await api.post('/api/post/comment/add', 
                {postId: post._id, content: commentText}, 
                {headers: { Authorization: `Bearer ${await getToken()}` }}
            )

            if(data.success){
                toast.success('Comment added successfully')
                setPost(data.post)
                setCommentText('')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSubmittingComment(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            const { data } = await api.post('/api/post/comment/delete', 
                {postId: post._id, commentId}, 
                {headers: { Authorization: `Bearer ${await getToken()}` }}
            )

            if(data.success){
                toast.success('Comment deleted successfully')
                setPost(data.post)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const navigate = useNavigate()

    const [showShare, setShowShare] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const postUrl = `${window.location.origin}/post/${post._id}`

    const handleShare = (type) => {
        if(type === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank')
        } else if(type === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(postUrl)}`, '_blank')
        } else if(type === 'copy') {
            navigator.clipboard.writeText(postUrl)
            toast.success('Link copied!')
        }
        setShowShare(false)
    }

    const handleDelete = async () => {
        try {
            const { data } = await api.post('/api/post/delete', {postId: post._id}, {headers: { Authorization: `Bearer ${await getToken()}` }})
            if (data.success){
               toast.success(data.message)
               window.location.reload()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleEditSuccess = () => {
        window.location.reload()
    }

    return (
    <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
        {/* User Info */}
        <div className='flex items-center justify-between'>
            <div onClick={()=> navigate('/profile/' + post.user._id)} className='inline-flex items-center gap-3 cursor-pointer'>
                <img src={post.user.profile_picture} alt="" className='w-10 h-10 rounded-full shadow'/>
                <div>
                    <div className='flex items-center space-x-1'>
                        <span>{post.user.full_name}</span>
                        <BadgeCheck className='w-4 h-4 text-blue-500'/>
                    </div>
                    <div className='text-gray-500 text-sm'>@{post.user.username} • {moment(post.createdAt).fromNow()}</div>
                </div>
            </div>
            {currentUser._id === post.user._id && (
                <div className='relative'>
                    <button onClick={() => setShowMenu(!showMenu)} className='text-gray-500 hover:text-gray-700 cursor-pointer'>
                        <MoreVertical className='w-5 h-5'/>
                    </button>
                    {showMenu && (
                        <div className='absolute z-50 top-6 right-0 bg-white border border-gray-200 rounded shadow-md flex flex-col'>
                            <button onClick={() => {setShowEdit(true); setShowMenu(false)}} className='px-4 py-2 text-left hover:bg-gray-100 text-sm whitespace-nowrap'>Edit post</button>
                            <button onClick={() => {handleDelete(); setShowMenu(false)}} className='px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-500 whitespace-nowrap'>Delete post</button>
                        </div>
                    )}
                </div>
            )}
        </div>
         {/* Content */}
         {post.content && <div className='text-gray-800 text-sm whitespace-pre-line' dangerouslySetInnerHTML={{__html: postWithHashtags}}/>}

       {/* Images */}
       <div className='grid grid-cols-2 gap-2'>
            {post.image_urls.map((img, index)=>(
                <img src={img} key={index} className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`} alt="" />
            ))}
       </div>

        {/* Actions */}
        <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
            <div className='flex items-center gap-1'>
                <Heart className={`w-4 h-4 cursor-pointer ${likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} onClick={handleLike}/>
                <span>{likes.length}</span>
            </div>
            <div className='flex items-center gap-1 cursor-pointer' onClick={() => setShowComments(!showComments)}>
                <MessageCircle className="w-4 h-4"/>
                <span>{post.comments?.length || 0}</span>
            </div>
                <div className='flex items-center gap-1 relative'>
                    <Share2 className="w-4 h-4 cursor-pointer" onClick={() => setShowShare(true)} />
                    {showShare && (
                        <div className="absolute z-50 top-8 right-0 bg-white border border-gray-200 rounded shadow-md flex flex-col min-w-40">
                            <button className="px-4 py-2 text-left hover:bg-gray-100 text-sm" onClick={() => handleShare('linkedin')}>Share on LinkedIn</button>
                            <button className="px-4 py-2 text-left hover:bg-gray-100 text-sm" onClick={() => handleShare('whatsapp')}>Share on WhatsApp</button>
                            <button className="px-4 py-2 text-left hover:bg-gray-100 text-sm" onClick={() => handleShare('copy')}>Copy Link</button>
                            <button className="px-4 py-2 text-left text-red-500 hover:bg-gray-100 text-sm" onClick={() => setShowShare(false)}>Close</button>
                        </div>
                    )}
                </div>

        </div>

        {/* Comments Section */}
        {showComments && (
            <div className='border-t border-gray-300 pt-4 space-y-4'>
                {/* Comment Input */}
                <form onSubmit={handleAddComment} className='flex gap-2 items-end'>
                    <img src={currentUser.profile_picture} alt="" className='w-8 h-8 rounded-full'/>
                    <div className='flex-1 flex gap-2'>
                        <input 
                            type="text" 
                            placeholder="Add a comment..." 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm'
                        />
                        <button 
                            type='submit' 
                            disabled={isSubmittingComment}
                            className='bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition cursor-pointer'
                        >
                            <Send className='w-4 h-4'/>
                        </button>
                    </div>
                </form>

                {/* Comments List */}
                <div className='space-y-3 max-h-96 overflow-y-auto'>
                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                            <div key={comment._id} className='flex gap-2 p-2 bg-gray-50 rounded-lg'>
                                <img src={comment.user.profile_picture} alt="" className='w-7 h-7 rounded-full'/>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-2'>
                                        <span className='font-semibold text-sm'>{comment.user.full_name}</span>
                                        <span className='text-xs text-gray-500'>@{comment.user.username}</span>
                                        <span className='text-xs text-gray-500'>{moment(comment.createdAt).fromNow()}</span>
                                    </div>
                                    <p className='text-sm text-gray-700 mt-1'>{comment.content}</p>
                                </div>
                                {currentUser._id === comment.user._id && (
                                    <button 
                                        onClick={() => handleDeleteComment(comment._id)}
                                        className='text-red-500 hover:text-red-700 p-1'
                                    >
                                        <Trash2 className='w-4 h-4'/>
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className='text-gray-500 text-sm text-center py-2'>No comments yet. Be the first!</p>
                    )}
                </div>
            </div>
        )}

        {/* Edit Post Modal */}
        {showEdit && <EditPostModal post={post} setShowEdit={setShowEdit} onSuccess={handleEditSuccess}/>}
    </div>
  )
}

export default PostCard
