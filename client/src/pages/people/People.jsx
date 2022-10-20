import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams} from 'react-router-dom'
import { getUser } from '../../api/UserRequest'
import { ToastContainer } from 'react-toastify'
import InfoCard from '../../components/infoCard/InfoCard'
import Navbar from '../../components/navbar/Navbar'
import PostSide from '../../components/postSide/PostSide'
import ProfileCard from '../../components/profileCard/ProfileCard'
import ProfileLeft from '../../components/profileLeft/ProfileLeft'
import RightSide from '../../components/rightSide/RightSide'
import "./people.css"

const People = () => {
  sessionStorage.setItem("active", "people");
  const [people, setPeople] = useState({});
  const {user} = useSelector((state)=>state.authReducer.authData);
  const id = useParams().id;
  const [peopleLoading, setPeopleLoading] = useState(false);
  useEffect(()=>{
    const fetchUser = async ()=>{
      await getUser(id).then((res)=>{
        setPeople(res.data);
      });
      setPeopleLoading(false);
    }
    if(user._id === id){
      setPeople(user);
    }
    else{
      setPeopleLoading(true);
      fetchUser();
    }
    
  }, [id, user])
  return (
    <>
    <div className="people-navbar">
      <Navbar />
    </div>
    
    <div className="people">
      <div className="people-left">
        <ProfileLeft />
      </div>
        
        <div className="peopleCenter">
          <div className="people-profileCard">
               <ProfileCard location="peoplePage"/>
          </div>
          <div className="people-infocard">
            <InfoCard />
          </div>
           
            <PostSide />
        </div>
        <div className="people-rightSide">
          <RightSide />
        </div>
        
    </div>
    <ToastContainer />
    </>

  )
}

export default People
