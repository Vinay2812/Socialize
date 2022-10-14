import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import PostSide from '../../components/postSide/PostSide'
import ProfileSide from '../../components/profileSide/ProfileSide'
import RightSide from '../../components/rightSide/RightSide'
import "./home.css"

import { toastParameters } from '../../components/toastParameters'



function Home() {
  const username = useSelector((state)=>state.authReducer.authData.user.username);
  useEffect(()=>{
    toast.success(`Welcome ${username}`, toastParameters)
  }, [username]);

  return (
    <>

    <div className="home">
        <ProfileSide location="homePage"/>
        <PostSide />
        <RightSide />
    </div>
    <ToastContainer />
    </>
  )
}

export default Home