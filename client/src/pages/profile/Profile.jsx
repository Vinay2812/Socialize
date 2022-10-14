import React from 'react'
import { ToastContainer } from 'react-toastify'
import PostSide from '../../components/postSide/PostSide'
import ProfileCard from '../../components/profileCard/ProfileCard'
import ProfileLeft from '../../components/profileLeft/ProfileLeft'
import RightSide from '../../components/rightSide/RightSide'
import "./profile.css"

const Profile = () => {
  return (
    <>
    <div className="profile">
        <ProfileLeft />
        <div className="profileCenter">
            <ProfileCard location="profilePage"/>
            <PostSide />
        </div>
        <RightSide />
    </div>
    <ToastContainer />
    </>
  )
}

export default Profile