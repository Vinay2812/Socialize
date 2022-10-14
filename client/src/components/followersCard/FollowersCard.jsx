import React from 'react'
import "./followersCard.css"

// import { followers } from '../../dummyData/followersData'
import { getAllUser } from '../../api/UserRequest'
import { useState } from 'react'

import {Link} from "react-router-dom"
import { useEffect } from 'react'

import {useDispatch, useSelector} from "react-redux"
import { followUser, unfollowUser } from '../../actions/UserAction'

const Follower = ({other_user})=>{
    const {user} = useSelector((state)=>state.authReducer.authData);
    const [isFollowing, setIsFollowing] = useState(other_user.followers.includes(user._id));

    const dispatch = useDispatch();
    const handleFollow = ()=>{
        if(isFollowing){
            dispatch(unfollowUser(other_user._id, user));
        }
        else{
            dispatch(followUser(other_user._id, user));
        }
        
        setIsFollowing(!isFollowing);
    }

    return (
        <div className="follower">
            <div>
                <img src={other_user.profilePicture.url} alt="" className='followerImg'/>
                <Link className="name" to={`/profile/${other_user._id}`}>
                    <span>{other_user.firstname} {other_user.lastname}</span>
                    <span>@{other_user.username}</span>
                </Link>
            </div>

            <button 
                className={!isFollowing?'button fc-button':'button fc-button unfollow' }
                onClick={handleFollow}
            >
                {!isFollowing?"Follow":"Unfollow"}
            </button>
        </div>
    )

}

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
        {allUsers.map((app_user, id)=>{
            if(app_user._id !== user._id){
                return <Follower other_user={app_user} key={id}/>
            }
            else{
                return null;
            } 
        })}
     </div>
  )
}

export default FollowersCard