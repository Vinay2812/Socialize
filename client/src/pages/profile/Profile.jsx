import React from 'react'
import { ToastContainer } from 'react-toastify'
import InfoCard from '../../components/infoCard/InfoCard'
import Navbar from '../../components/navbar/Navbar'
import PostSide from '../../components/postSide/PostSide'
import ProfileCard from '../../components/profileCard/ProfileCard'
import ProfileLeft from '../../components/profileLeft/ProfileLeft'
import RightSide from '../../components/rightSide/RightSide'
import "./profile.css"

const Profile = () => {
  return (
    <>
    <div className="profile-navbar">
      <Navbar />
    </div>
    
    <div className="profile">
      <div className="profile-left">
        <ProfileLeft />
      </div>
        
        <div className="profileCenter">
          <div className="profile-profileCard">
               <ProfileCard location="profilePage"/>
          </div>
          <div className="profile-infocard">
            <InfoCard />
          </div>
           
            <PostSide />
        </div>
        <div className="profile-rightSide">
          <RightSide />
        </div>
        
    </div>
    <ToastContainer />
    </>
  )
}

export default Profile