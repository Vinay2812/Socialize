import { AddBox, ChatOutlined, ExitToApp, GroupOutlined, HomeOutlined, NotificationsNoneOutlined, Search, SettingsOutlined, TrendingUp } from "@material-ui/icons"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import "./navbar.css"
import Logo from "./Logo/socialize-logo-white.png"
import { logout } from "../../actions/AuthAction"
import PostShare from "../postShare/PostShare"
import { useState } from "react"

const Navbar = () => {
  const dispatch = useDispatch();
  const [postShare, setPostShare] = useState(false);
  const {profilePicture, _id} = useSelector((state)=>state.authReducer.authData.user);
  const handleLogout = ()=>{
      dispatch(logout());
  }
  return (
    <>{
      !postShare 
        ? <div className="navbar">  
            <div className="navItemContainer">
              <div className="logoSearch">
                <Link to="/home">
                  <img src={Logo} alt="" className='logo'/>
                </Link>
                <div className="search">
                    <input type="text" placeholder="#Explore" className='search'/>
                    <div className="searchIcon">
                        <Search className='icon'/>
                    </div>
                </div>
              </div>
            </div>
            <div className="navItemContainer">
              <div className="centerNavIcons">
                <div className="navIcons">
                    <Link to="/home" style={{textDecoration: "none", color: "inherit"}}>
                      <HomeOutlined />
                      <span>Home</span>
                    </Link>
                </div>
                <div className="navIcons">
                    <Link to="/home" style={{textDecoration: "none", color: "inherit"}}>
                      <GroupOutlined />
                      <span>People</span>
                    </Link>
                </div>
                <div className="navIcons" onClick={()=>setPostShare(true)}>
                    <AddBox />
                    <span>New Post</span>
                </div>

                <div className="navIcons">
                  <ChatOutlined />
                  <span>Chat</span>
                </div>
                <div className="navIcons">
                    <Link to={`/profile/${_id}`}style={{textDecoration: "none", color: "inherit"}}>
                      <img src={profilePicture.url} alt="" crossorigin/>
                      <span>Profile</span>
                    </Link>
                </div>
                
              </div>
            </div>
            <div className="navItemContainer">
              <div className="rightNavIcons">
              
                <div className="navIcons">
                  <TrendingUp />
                  <span>Trendings</span>
                </div>
                <div className="navIcons">
                  <NotificationsNoneOutlined />
                  <span>Notifications</span>
                </div>
                <div className="navIcons">
                  <SettingsOutlined />
                  <span>Settings</span>
                </div>
                <div className="navIcons">
                  <ExitToApp onClick={handleLogout}/>
                  <span>Logout</span>
                </div>
                
              </div>
            </div>   
        </div>
        :<>
          <div className="blur"></div>
          <div className="new-post">
            <PostShare setPostShare={setPostShare}/>
          </div>
        </>

    }
    
    
    </>

  )
}

export default Navbar