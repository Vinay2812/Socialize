import React from 'react'
import "./rightSide.css"

import TrendCard from '../trendCard/TrendCard'

const RightSide = () => {

  return (
    <div className="rightSide">
      
      <TrendCard />

      <button className='button r-button'>
          Settings
      </button>
    </div>
  )
}

export default RightSide