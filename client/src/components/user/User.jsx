import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import "./user.css"
import { followUser, unfollowUser } from '../../actions/UserAction'
import { getTimeLinePosts } from '../../actions/PostAction'
import { Link } from 'react-router-dom';


const User = ({other_user})=>{
    const {user} = useSelector((state)=>state.authReducer.authData);
    const {posts} = useSelector((state)=>state.postReducer);

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
    const [hover, setHover] = useState(false);
   

    return (
        <div className="user" >
            <img src={other_user.coverPicture.url} alt="Loading..." className='user-cover'/>
            
            <div className="img-name" onMouseOver={()=>setHover(true)} onMouseOut={()=>setHover(false)}>
                <img src={other_user.profilePicture.url} alt="Loading..." className='followerImg'/>
                <Link className="allusers-name" to={`/profile/${other_user._id}`}>
                    <span onMouseOver={()=>setHover(true)} onMouseOut={()=>setHover(false)}>{other_user.firstname} {other_user.lastname}</span>
                    <span>@{other_user.username}</span>
                </Link>
                {
                    hover ? 
                    <Link to={`/profile/${other_user._id}`}>
                        <div className="user-profile-card">
                            <div className="user-profile-top">
                                <img className = "profile" src={other_user.profilePicture.url} alt="Loading..." />
                                <img className = "cover" src = {other_user.coverPicture.url} alt="Loading..." />
                            </div>

                            <div className="user-profile-info">
                                <span className='name'>
                                    {other_user.firstname} {other_user.lastname}
                                </span>
                                <span className='username'>@{other_user.username}</span>
                            </div>
                            <div className="user-profile-bio">
                                {other_user.bio}
                            </div>
                            <div className="user-profile-follower-info">
                                <span>
                                    {other_user.followers.length} 
                                    <span className='follower-text'>followers</span>
                                </span>
                                <span>
                                    {other_user.following.length}
                                    <span className='follower-text'>following</span>
                                </span>
                                <span>
                                    {posts.filter((post)=>post.userId === other_user._id).length}
                                    <span className='follower-text'>posts</span>
                                </span>
                            </div>
                            <div className="user-profile-follow">
                                {
                                     other_user._id === user._id ? "":
                                     <button 
                                         className={!isFollowing?'button fc-button':'button fc-button unfollow' }
                                         onClick={handleFollow}
                                     >
                                         {!user.following.includes(other_user._id)?"follow":"following"}
                                     </button>
                                 }
                            </div>
                        </div>
                    </Link>   
                    : ""
                }
            </div>
            
            {
                other_user._id === user._id ? "":
                <button 
                    className={!isFollowing?'button fc-button':'button fc-button unfollow' }
                    onClick={handleFollow}
                >
                    {!user.following.includes(other_user._id)?"follow":"following"}
                </button>
            }
           
        </div>
    )

}

export default User