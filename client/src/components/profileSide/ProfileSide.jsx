import React from 'react'
import LogoSearch from '../logoSearch/LogoSearch'
import ProfileCard from '../profileCard/ProfileCard'
import FollowersCard from "../followersCard/FollowersCard"
import "./profileSide.css"
function ProfileSide() {
  return (
    <div className='profileSide'>
        <LogoSearch />
        <ProfileCard />
        <FollowersCard />
    </div>
  )
}

export default ProfileSide