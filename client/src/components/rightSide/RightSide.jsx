import React from 'react'
import "./rightSide.css"

import TrendCard from '../trendCard/TrendCard'

import { useDispatch } from 'react-redux'
import { logout } from '../../actions/AuthAction'

const RightSide = () => {
  const dispatch = useDispatch();

  const handleLogout = ()=>{
      dispatch(logout());
  }
  return (
    <div className="rightSide">
      
      <TrendCard />

      <button className='button r-button' onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default RightSide