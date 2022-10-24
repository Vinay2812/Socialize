import { AddBox, CancelOutlined, ChatOutlined, ExitToApp, GroupOutlined, HomeOutlined, MenuOutlined, NotificationsNoneOutlined, Search, TrendingUp } from "@material-ui/icons"
import { useDispatch, useSelector } from "react-redux"
import { Link} from "react-router-dom"
import "./navbar.css"
import Logo from "./Logo/logo.png"
import { logout } from "../../actions/AuthAction"
import PostShare from "../postShare/PostShare"
import { useState } from "react"
import RightSide from "../rightSide/RightSide"
import { useRef } from "react"
import { useEffect } from "react"
import { searchUser } from "../../api/UserRequest"


const SearchUser = ({user, setSearch})=>{
  return (
    <div className="search-user" onClick={()=>setSearch(false)}>
      <Link to={`/profile/${user._id}`}>
        <img src={user.profilePicture.url} alt=""/>
        <div className="search-names">
          <div className="search-fullname">
            {user.firstname} {user.lastname}
          </div>
          <div className="search-username">
            @{user.username}
          </div>
        </div>
      </Link>
    </div>
  )
}

const RightNavbarIcons = ()=>{
  const dispatch = useDispatch();
  const handleLogout = ()=>{
    dispatch(logout());
  }
  const [rightActive, setRightActive] = useState("trendings");
  return (
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
  )
}
const Navbar = () => {
  
  const [postShare, setPostShare] = useState(false);
  const {profilePicture, _id} = useSelector((state)=>state.authReducer.authData.user);
  
  const centerActive = sessionStorage.getItem("active");
  
  const [menu, setMenu] = useState(false);

  const searchRef = useRef();

  const [search, setSearch] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const [users, setUsers] = useState({});

  const handleSearch = ()=>{
    setSearch(true)
    setSearchVal(searchRef.current.value);
  }

  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(()=>{
    
    const searchUsers = async ()=>{
      setSearchLoading(true);
      const data = {
        name: searchRef.current.value
      }
      const res = await searchUser(data);
      setUsers(res.data);
      setSearchLoading(false);
    }
    if(searchVal.length <= 0){
      setSearch(false);
      return;
    }
    
    searchUsers();
  }, [searchVal])
  return (
    <>
      {
        menu ? 
        <>
        <div className="menu-bar">
          <CancelOutlined onClick={()=>{
            setMenu(false);
          }}/>
          <div className="menu-rightNavIcons">
            <RightNavbarIcons />
          </div>
          <RightSide />
        </div>
        <div className="menu-bar-left" onClick={()=>setMenu(false)}></div>
        
        </>
        : ""
      }
     <div className="navbar">  
        <div className="navItemContainer">
          <div className="logoSearch" >
            <Link to="/home">
              <img src={Logo} alt="" className='logo'/>
            </Link>
            <div className="search">
                <input type="text" value={searchVal} placeholder="#Explore" className='search' ref={searchRef} onChange={handleSearch}/>
                <div className="searchIcon">
                    <Search className='icon'/>
                </div>
            </div>
            
          </div>
          <div className="menu" onClick={()=>setMenu(true)}>
              <MenuOutlined />
          </div>
        </div>
        <div className="navItemContainer">
          <div className="centerNavIcons">
            <div className={centerActive==="home"?"navIcons active":"navIcons"}>
                <div className = 'sphere'></div>
                <Link to="/home" style={{textDecoration: "none", color: "inherit"}}>
                  <HomeOutlined />
                  <span>Home</span>
                </Link>
            </div>
            <div className={centerActive==="people"?"navIcons active":"navIcons"} >
                <div className = 'sphere'></div>
                <Link to={`/people/${_id}`} style={{textDecoration: "none", color: "inherit"}}>
                  <GroupOutlined />
                  <span>People</span>
                </Link>
            </div>
            <div className="navIcons" onClick={()=>{setPostShare(true);}}>
                <AddBox />
                <span>New Post</span>
            </div>

            <div className={centerActive==="chat"?"navIcons active":"navIcons"} onClick={()=>sessionStorage.setItem("active", "chat")}>
              <Link to="#" style={{textDecoration: "none", color: "inherit"}}>
                <div className = 'sphere'></div>
                <ChatOutlined />
                <span>Chat</span>
              </Link>
            </div>
            <div className={centerActive==="profile"?"navIcons active":"navIcons"} >
            <div className = 'sphere'></div>
                <Link to={`/profile/${_id}`}style={{textDecoration: "none", color: "inherit"}}>
                  <img src={profilePicture.url} alt="" crossorigin/>
                  <span>Profile</span>
                </Link>
            </div>
            
          </div>
        </div>
        <div className="navItemContainer">
          <RightNavbarIcons />
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
      {
        search ?
        
        <>
          <div className="search-results">
            <CancelOutlined onClick={()=>{
              setSearch(false);
              setSearchVal("");
            }}/>
          {    searchLoading 
            ? "Loading..."
            :
              users.length ? users.map((user)=>{
                return <SearchUser user={user} setSearch={setSearch}/>
              }) : <div> No user found</div>
            
          } 
          </div> 
          <div className="empty" onClick={()=>{setSearch(false);setSearchVal("")}}>
    
          </div>
        </>
        : ""
      }
      
    </>
        
  )
}

export default Navbar