import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams} from 'react-router-dom'
import { getUser } from '../../api/UserRequest'
import { ToastContainer } from 'react-toastify'
import Navbar from '../../components/navbar/Navbar'
import ProfileLeft from '../../components/profileLeft/ProfileLeft'
import RightSide from '../../components/rightSide/RightSide'
import "./people.css"
import User from '../../components/user/User'

const People = () => {
  sessionStorage.setItem("active", "people");
  const  self = useSelector((state)=>state.authReducer.authData.user);
  const id = useParams().id;

  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  useEffect(()=>{

    const fetchUser = async ()=>{
      const {data} = await getUser(id);
      return data;
    }
    if(id === self._id){
      setUser(self);
    }
    else{
      setUserLoading(true);
      fetchUser().then((data)=>{
        setUser(data);
        setUserLoading(false);
      })
      
    }
  }, [id])

  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);

  useEffect(()=>{
    const getPeople = async ()=>{
      setFollowers(await Promise.all(
        user?.followers.map(async (id)=>{
          const {data} = await getUser(id);
          return data;
        })
      ));

      setFollowing(await Promise.all(
        user?.following.map(async (id)=>{
          const {data} = await getUser(id);
          return data;
        })
      ))
    }
    if(!user)return;
    getPeople();
  },[user, userLoading]);

  const [peopleActive, setPeopleActive] = useState("followers")

  return (
    <>
    <div className="people-navbar">
      <Navbar />
    </div>
    
    <div className="people">
      <div className="people-left">
        <ProfileLeft />
      </div>
      {
          userLoading ? "Loading..."
          : 
          
          <div className="peopleCenter">
          <div className="people-options">
            
              <div className={peopleActive === "followers" ?'people-option active': 'people-option'} onClick={()=>setPeopleActive("followers")}>
                <div className="sphere">{user?.followers.length}</div>
                <span>Followers</span>
              </div>
              <div className="vl"></div>
              <div className={peopleActive === "following"?'people-option active': 'people-option'} onClick={()=>setPeopleActive("following")}>
                <div className="sphere">{user?.followers.length}</div>
                <span>Followings</span>
              </div>
          </div>
          {
            
            peopleActive === "followers" ?
            <div className="people-info">
              {
                followers?.map((follower)=>{
                  return <User other_user={follower}/>
                })
              }
            </div>
            :
              <div className="people-info">
              {
                  following?.map((f)=>{
                    return <User other_user={f}/>
                  })
                }
           </div>
          }     
        </div>

      }
        
        <div className="people-rightSide">
          <RightSide />
        </div>
        
    </div>
    <ToastContainer />
    </>

  )
}

export default People
