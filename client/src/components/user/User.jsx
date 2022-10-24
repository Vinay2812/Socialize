import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import "./user.css"
import { followUser, unfollowUser } from '../../actions/UserAction'
import { getTimeLinePosts } from '../../actions/PostAction'
import { Link } from 'react-router-dom';


const User = ({other_user})=>{
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
        <div className="user">
            <img src={other_user.coverPicture.url} alt="Loading..." className='user-cover'/>
            
            <div className="img-name">
                <img src={other_user.profilePicture.url} alt="Loading..." className='followerImg'/>
                <Link className="allusers-name" to={`/profile/${other_user._id}`}>
                    <span >{other_user.firstname} {other_user.lastname}</span>
                    <span>@{other_user.username}</span>
                    {/* <div className="user-bio">
                        {other_user.bio}
                    </div> */}
                </Link>
            </div>
 
            
            {other_user._id === user._id ? "":
                <button 
                    className={!isFollowing?'button fc-button':'button fc-button unfollow' }
                    onClick={handleFollow}
                >
                    {!user.following.includes(other_user._id)?"Follow":"Unfollow"}
                </button>
            }
        </div>
    )

}

export default User