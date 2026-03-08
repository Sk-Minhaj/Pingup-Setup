import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil, X, Linkedin, Twitter, Github, Globe } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../features/user/userSlice';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const ProfileModal = ({setShowEdit}) => {

    const dispatch = useDispatch();
    const {getToken} = useAuth()

    const user = useSelector((state) => state.user.value)
    const [editForm, setEditForm] = useState({
        username: user.username,
        bio: user.bio,
        location: user.location,
        profile_picture: null,
        cover_photo: null,
        full_name: user.full_name,
        social_media: user.social_media || {
            linkedin: '',
            twitter: '',
            github: '',
            devto: '',
            medium: '',
            portfolio: ''
        }
    })

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {

            const userData = new FormData();
            const {full_name, username, bio, location, profile_picture, cover_photo, social_media} = editForm

            userData.append('username', username);
            userData.append('bio', bio);
            userData.append('location', location);
            userData.append('full_name', full_name);
            userData.append('social_media', JSON.stringify(social_media));
            profile_picture && userData.append('profile', profile_picture)
            cover_photo && userData.append('cover', cover_photo)

            const token = await getToken()
            dispatch(updateUser({userData, token}))

            setShowEdit(false)
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50 flex items-center justify-center p-4'>
      <div className='max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden'>
        
        {/* Header */}
        <div className='bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex items-center justify-between'>
            <h1 className='text-2xl font-bold text-white'>Edit Profile</h1>
            <button onClick={() => setShowEdit(false)} className='text-white hover:bg-white/20 p-2 rounded-lg transition cursor-pointer'>
                <X className='w-6 h-6'/>
            </button>
        </div>

        <form className='p-6 space-y-6' onSubmit={e=> toast.promise(
            handleSaveProfile(e), {loading: 'Saving...'}
        )}>
            
            {/* Profile and Cover Photos */}
            <div className='space-y-4'>
                <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-3'>Cover Photo</label>
                    <label htmlFor="cover_photo" className='cursor-pointer'>
                        <input hidden type="file" accept="image/*" id="cover_photo" onChange={(e)=>setEditForm({...editForm, cover_photo: e.target.files[0]})}/>
                        <div className='group/cover relative overflow-hidden'>
                            <img src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} alt="" className='w-full h-48 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover'/>
                            <div className='absolute hidden group-hover/cover:flex top-0 left-0 right-0 bottom-0 bg-black/40 rounded-lg items-center justify-center'>
                                <Pencil className="w-6 h-6 text-white"/>
                            </div>
                        </div>
                    </label>
                </div>

                <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-3'>Profile Picture</label>
                    <label htmlFor="profile_picture" className='cursor-pointer'>
                        <input hidden type="file" accept="image/*" id="profile_picture" onChange={(e)=>setEditForm({...editForm, profile_picture: e.target.files[0]})}/>
                        <div className='group/profile relative w-32 h-32'>
                            <img src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} alt="" className='w-full h-full rounded-full object-cover border-4 border-indigo-100'/>
                            <div className='absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/40 rounded-full items-center justify-center'>
                                <Pencil className="w-6 h-6 text-white"/>
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            {/* Basic Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                    <input type="text" className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition' placeholder='Your full name' onChange={(e)=>setEditForm({...editForm, full_name: e.target.value})} value={editForm.full_name}/>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Username</label>
                    <input type="text" className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition' placeholder='@username' onChange={(e)=>setEditForm({...editForm, username: e.target.value})} value={editForm.username}/>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Bio</label>
                <textarea rows={3} className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition' placeholder='Tell us about yourself' onChange={(e)=>setEditForm({...editForm, bio: e.target.value})} value={editForm.bio}/>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
                <input type="text" className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition' placeholder='Your location' onChange={(e)=>setEditForm({...editForm, location: e.target.value})} value={editForm.location}/>
            </div>

            {/* Social Media Links */}
            <div className='border-t border-gray-200 pt-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Social Media & Links</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Linkedin className='w-4 h-4 text-blue-600'/>LinkedIn
                        </label>
                        <input type="url" className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition' placeholder='linkedin.com/in/yourprofile' onChange={(e)=>setEditForm({...editForm, social_media: {...editForm.social_media, linkedin: e.target.value}})} value={editForm.social_media.linkedin}/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Twitter className='w-4 h-4 text-blue-400'/>Twitter
                        </label>
                        <input type="url" className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition' placeholder='twitter.com/yourprofile' onChange={(e)=>setEditForm({...editForm, social_media: {...editForm.social_media, twitter: e.target.value}})} value={editForm.social_media.twitter}/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Github className='w-4 h-4 text-gray-800'/>GitHub
                        </label>
                        <input type="url" className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition' placeholder='github.com/yourprofile' onChange={(e)=>setEditForm({...editForm, social_media: {...editForm.social_media, github: e.target.value}})} value={editForm.social_media.github}/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dev.to</label>
                        <input type="url" className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition' placeholder='dev.to/yourprofile' onChange={(e)=>setEditForm({...editForm, social_media: {...editForm.social_media, devto: e.target.value}})} value={editForm.social_media.devto}/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Medium</label>
                        <input type="url" className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition' placeholder='medium.com/@yourprofile' onChange={(e)=>setEditForm({...editForm, social_media: {...editForm.social_media, medium: e.target.value}})} value={editForm.social_media.medium}/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Globe className='w-4 h-4 text-purple-600'/>Portfolio
                        </label>
                        <input type="url" className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition' placeholder='yourportfolio.com' onChange={(e)=>setEditForm({...editForm, social_media: {...editForm.social_media, portfolio: e.target.value}})} value={editForm.social_media.portfolio}/>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
                <button onClick={()=> setShowEdit(false)} type='button' className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer'>Cancel</button>
                <button type='submit' className='px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer'>Save Changes</button>
            </div>

        </form>
      </div>
    </div>
  )
}

export default ProfileModal
