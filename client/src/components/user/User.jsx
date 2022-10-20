import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import "./user.css"
import { followRequest, unfollowUser, cancelFollowRequest, acceptFollowRequest, rejectFollowRequest } from '../../actions/UserAction'
import { getTimeLinePosts } from '../../actions/PostAction'
import { Link } from 'react-router-dom';


const User = ({other_user})=>{
    const {user} = useSelector((state)=>state.authReducer.authData);
    const user_follow_status = {
        1: "follow", //not in users followers and following
        2: "cancel", //in users requestSend
        3: "accept", // in users requestReceived
        4: "reject", // in users requestReceived
        5: "follow back", // in users followers and not in following
        6: "following" // in users followers and following
    }
    const getStatus = ()=>{
        if(user.requestSend.includes(other_user._id)){
            return 2;
        }
        else if(user.requestReceived.includes(other_user._id)){
            return 3;
        }
        else if(user.followers.includes(other_user._id) && user.following.includes(other_user._id)){
            return 6;
        }
        else if(user.followers.includes(other_user._id) && !user.following.includes(other_user._id)){
            return 5;
        }
        else {
            return 1;
        }
        
    }
    const [status, setStatus] = useState(getStatus);

    const dispatch = useDispatch();

    const handleFollow = ()=>{
        switch (status) {
            case 1:
                dispatch(followRequest(other_user._id, user)).then(()=>alert("Sent"));
                setStatus(2);
                break;
            case 2:
                dispatch(cancelFollowRequest(other_user._id, user));
                setStatus(getStatus());
                break;
            case 3:
                dispatch(acceptFollowRequest(other_user._id, user));
                setStatus(getStatus());
                break;
            case 4:
                dispatch(rejectFollowRequest(other_user._id, user));
                setStatus(1);
                break;
            case 5:
                dispatch(followRequest(other_user._id, user));
                setStatus(2);
                break;
            case 6:
                dispatch(unfollowUser(other_user._id, user));
                setStatus(1);
                break;
            default:
                break;
        }
    }

    return (
        <div className="user">
            <img src={other_user.profilePicture.url} alt="" className='followerImg' crossorigin/>
            <Link className="allusers-name" to={`/profile/${other_user._id}`}>
                <span>{other_user.firstname} {other_user.lastname}</span>
                <span>@{other_user.username}</span>
            </Link>
        <div className="request-btn-container">
            <button 
                className={status === 1?'button fc-button':'border-button fc-button' }
                onClick={handleFollow}
            >
                {   
                    user_follow_status[status]
                }
            </button>
            {
                status === 3?
                <button 
                    className='border-button fc-button'
                    onClick={()=>{
                        setStatus(4);
                        handleFollow();
                    }}
                >
                    {user_follow_status[4]}
                </button>
                : ""
            }
            
        </div>
            


        </div>
    )

}

export default User