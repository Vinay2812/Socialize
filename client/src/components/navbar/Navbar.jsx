import { AddBox, ChatOutlined, ExitToApp, GroupOutlined, HomeOutlined, NotificationsNoneOutlined, Search, TrendingUp } from "@material-ui/icons"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
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

  const params = useParams();

  const [centerActive, setCenterActive] = useState(params.id?"profile":"home");
  const [rightActive, setRightActive] = useState("trendings");

  return (
    <>
     <div className="navbar">  
        <div className="navItemContainer">
          <div className="logoSearch" >
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
            <div className={centerActive==="home"?"navIcons active":"navIcons"} onClick={()=>setCenterActive("home")}>
                <div className = 'sphere'></div>
                <Link to="/home" style={{textDecoration: "none", color: "inherit"}}>
                  <HomeOutlined />
                  <span>Home</span>
                </Link>
            </div>
            <div className={centerActive==="people"?"navIcons active":"navIcons"} onClick={()=>setCenterActive("people")}>
                <div className = 'sphere'></div>
                <Link to="/home" style={{textDecoration: "none", color: "inherit"}}>
                  <GroupOutlined />
                  <span>People</span>
                </Link>
            </div>
            <div className="navIcons" onClick={()=>{setPostShare(true);setCenterActive("home");}}>
                <AddBox />
                <span>New Post</span>
            </div>

            <div className={centerActive==="chat"?"navIcons active":"navIcons"} onClick={()=>setCenterActive("chat")}>
              <div className = 'sphere'></div>
              <ChatOutlined />
              <span>Chat</span>
            </div>
            <div className={centerActive==="profile"?"navIcons active":"navIcons"} onClick={()=>setCenterActive("profile")}>
            <div className = 'sphere'></div>
                <Link to={`/profile/${_id}`}style={{textDecoration: "none", color: "inherit"}}>
                  <img src={profilePicture.url} alt="" crossorigin/>
                  <span>Profile</span>
                </Link>
            </div>
            
          </div>
        </div>
        <div className="navItemContainer">
          <div className="rightNavIcons">
          
            <div className={rightActive === "trendings" ?"navIcons active" : "navIcons"} onClick={()=>setRightActive("trendings")}>
              <div className = 'sphere'></div>
              <TrendingUp />
              <span>Trendings</span>
            </div>
            <div className={rightActive === "notifications" ?"navIcons active" : "navIcons"} onClick={()=>setRightActive("notifications")}>
              <div className = 'sphere'></div>
              <NotificationsNoneOutlined />
              <span>Notifications</span>
            </div>
            <div className="navIcons" onClick={handleLogout}>
              <div className = 'sphere'></div>
              <ExitToApp />
              <span>Logout</span>
            </div>
            
          </div>
        </div>   
      </div>
        {
          postShare ? 
            <>
              <div className="blur"></div>
              <div className="new-post">
                <PostShare setPostShare={setPostShare}/>
              </div>
            </>
        : ""
        } 
    </>
  )
}

export default Navbar