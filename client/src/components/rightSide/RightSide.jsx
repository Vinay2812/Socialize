import React from 'react'
import "./rightSide.css"
import {HomeOutlined , NotificationsNoneOutlined, ChatOutlined, ExitToApp} from "@material-ui/icons"
import TrendCard from '../trendCard/TrendCard'
import {Link} from "react-router-dom"
import { useDispatch } from 'react-redux'
import { logout } from '../../actions/AuthAction'

const RightSide = () => {
  const dispatch = useDispatch();

  const handleLogout = ()=>{
      dispatch(logout());
  }
  return (
    <div className="rightSide">
      <div className="navIcons">
        <div>
          <Link to="/home" style={{textDecoration: "none", color: "inherit"}}>
            <HomeOutlined />
            <span>Home</span>
          </Link>
        </div>
        <div>
          <NotificationsNoneOutlined />
          <span>Notifications</span>
        </div>
        <div>
          <ChatOutlined />
          <span>Chat</span>
        </div>
        <div>
          <ExitToApp onClick={handleLogout}/>
          <span>Logout</span>
        </div>
      </div>
      <TrendCard />

      <button className='button r-button' onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default RightSide