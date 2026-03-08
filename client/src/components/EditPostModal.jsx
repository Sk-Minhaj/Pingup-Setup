import React, { useState } from 'react'
import { X, Image } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import CodeSnippetEditor from './CodeSnippetEditor'
import CodeSnippetDisplay from './CodeSnippetDisplay'

const EditPostModal = ({post, setShowEdit, onSuccess}) => {

    const [content, setContent] = useState(post.content)
    const [images, setImages] = useState([])
    const [codeSnippets, setCodeSnippets] = useState(post.code_snippets || [])
    const [loading, setLoading] = useState(false)
    const { getToken } = useAuth()

    const handleSubmit = async () => {
        if(!images.length && !content && !codeSnippets.length){
            return toast.error('Please add content, images, or code snippets')
        }
        setLoading(true)

        try {
            const formData = new FormData();
            formData.append('content', content)
            formData.append('postId', post._id)
            formData.append('code_snippets', JSON.stringify(codeSnippets))
            images.map((image) => {
                formData.append('images', image)
            })

            const { data } = await api.post('/api/post/edit', formData, {headers: { Authorization: `Bearer ${await getToken()}`}})

            if (data.success) {
                toast.success('Post updated successfully')
                setShowEdit(false)
                onSuccess()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        setLoading(false)
    }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50'>
      <div className='max-w-2xl sm:py-6 mx-auto'>
        <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center justify-between mb-6'>
                <h1 className='text-2xl font-bold text-gray-900'>Edit Post</h1>
                <button onClick={() => setShowEdit(false)} className='cursor-pointer'>
                    <X className='w-6 h-6'/>
                </button>
            </div>

            <form className='space-y-4' onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                    </label>
                    <textarea rows={4} className='w-full p-3 border border-gray-200 rounded-lg' placeholder='What do you want to say?' onChange={(e)=>setContent(e.target.value)} value={content}/>
                </div>

                {/* Current Images */}
                {post.image_urls.length > 0 && (
                    <div>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Current Images</p>
                        <div className='flex flex-wrap gap-2'>
                            {post.image_urls.map((img, i) => (
                                <img key={i} src={img} className='h-20 rounded-md object-cover' alt="" />
                            ))}
                        </div>
                    </div>
                )}

                {/* New Images */}
                {images.length > 0 && (
                    <div>
                        <p className='text-sm font-medium text-gray-700 mb-2'>New Images</p>
                        <div className='flex flex-wrap gap-2'>
                            {images.map((image, i)=>(
                                <div key={i} className='relative group'>
                                    <img src={URL.createObjectURL(image)} className='h-20 rounded-md object-cover' alt="" />
                                    <div onClick={()=> setImages(images.filter((_, index)=> index !== i))} className='absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer'>
                                        <X className="w-6 h-6 text-white"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="new-images" className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer'>
                        <Image className='size-6'/>
                        <span>Add new images</span>
                    </label>
                    <input type="file" id="new-images" accept='image/*' hidden multiple onChange={(e)=>setImages([...images, ...e.target.files])}/>
                </div>

                {/* Code Snippets */}
                {codeSnippets.length > 0 && (
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                            <h3 className='font-semibold text-gray-900'>Code Snippets</h3>
                            <button
                                type='button'
                                onClick={() => setCodeSnippets(codeSnippets.slice(0, -1))}
                                className='text-sm text-red-600 hover:text-red-700 cursor-pointer'
                            >
                                Remove Last
                            </button>
                        </div>
                        {codeSnippets.map((snippet, i) => (
                            <div key={i} className='relative'>
                                <button
                                    type='button'
                                    onClick={() => setCodeSnippets(codeSnippets.filter((_, idx) => idx !== i))}
                                    className='absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white p-1 rounded'
                                >
                                    <X className='w-4 h-4' />
                                </button>
                                <CodeSnippetDisplay snippet={snippet} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Code Snippet Editor */}
                <CodeSnippetEditor onAddSnippet={(snippet) => setCodeSnippets([...codeSnippets, snippet])} />

                <div className='flex justify-end space-x-3 pt-6'>
                    <button onClick={()=> setShowEdit(false)} type='button' className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'>Cancel</button>
                    <button disabled={loading} type='submit' className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer disabled:opacity-50'>Save Changes</button>
                </div>

            </form>
        </div>
      </div>
    </div>
  )
}

export default EditPostModal
