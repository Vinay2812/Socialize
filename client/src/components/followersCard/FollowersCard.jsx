import React from 'react'
import "./followersCard.css"

import { getAllUser } from '../../api/UserRequest'
import { useState } from 'react'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import User from '../user/User'

const FollowersCard = () => {
    const [allUsers, setAllUsers] = useState([]);
    const {user} = useSelector((state)=>state.authReducer.authData);

    useEffect(()=>{
        const fetchUsers = async ()=>{
            let {data} = await getAllUser();
            setAllUsers(data);
        }
        fetchUsers();
    },[user]);
  return (
     <div className="followersCard">
        <h3>
            Socialize Users
        </h3>
        <div className="all-users">
            {allUsers.map((app_user, id)=>{
                if(app_user._id !== user._id){
                    return <User other_user={app_user} key={id}/>
                }
                else{
                    return null;
                } 
            })}
        </div>
        
     </div>
  )
}

export default FollowersCard