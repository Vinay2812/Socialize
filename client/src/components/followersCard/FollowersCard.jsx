import React from 'react'
import "./followersCard.css"

// import { followers } from '../../dummyData/followersData'
import { getAllUser } from '../../api/UserRequest'
import { useState } from 'react'

import {Link} from "react-router-dom"
import { useEffect } from 'react'

import {useDispatch, useSelector} from "react-redux"
import { followUser, unfollowUser } from '../../actions/UserAction'
import { getTimeLinePosts } from '../../actions/PostAction'

const Follower = ({other_user})=>{
    const {user} = useSelector((state)=>state.authReducer.authData);
    const [isFollowing, setIsFollowing] = useState(user.following.includes(other_user._id));

    const dispatch = useDispatch();
    useEffect(()=>{
        setIsFollowing(user.following.includes(other_user._id))
    }, [other_user, user]);
    const handleFollow = ()=>{
        if(isFollowing){
            dispatch(unfollowUser(other_user._id, user)).then(()=>{
                dispatch(getTimeLinePosts(user._id));
            });
        }
        else{
            dispatch(followUser(other_user._id, user)).then(()=>{
                dispatch(getTimeLinePosts(user._id));
            });
        }
        
        setIsFollowing(user.following.includes(user._id));
    }

    return (
        <div className="follower">
            <img src={other_user.profilePicture.url} alt="" className='followerImg' crossorigin/>
            <Link className="allusers-name" to={`/profile/${other_user._id}`}>
                <span>{other_user.firstname} {other_user.lastname}</span>
                <span>@{other_user.username}</span>
            </Link>

            <button 
                className={!isFollowing?'button fc-button':'button fc-button unfollow' }
                onClick={handleFollow}
            >
                {!user.following.includes(other_user._id)?"Follow":"Unfollow"}
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
        <div className="all-users">
            {allUsers.map((app_user, id)=>{
                if(app_user._id !== user._id){
                    return <Follower other_user={app_user} key={id}/>
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