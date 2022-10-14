import React from 'react'
import FollowersCard from '../followersCard/FollowersCard'
import InfoCard from '../infoCard/InfoCard'
import "./profileLeft.css"
const ProfileLeft = () => {
  return (
    <div className="profileLeft">

        <InfoCard />
        <FollowersCard />
    </div>
  )
}

export default ProfileLeft