import React, { useEffect, useState } from 'react'
import "./post.css"
import { FavoriteBorderOutlined, FavoriteOutlined, MoreVert, DeleteOutline, ShareOutlined, EditOutlined, CloseOutlined, AddCommentOutlined, NearMeOutlined, Send } from "@material-ui/icons"

import PostComment from '../postComment/PostComment'
import { useDispatch, useSelector } from 'react-redux'
import { deletePost, likePost } from '../../api/PostRequest'
import { getUser } from '../../api/UserRequest'

import {toast, ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import {toastParameters} from "../toastParameters"

import { addComment, getTimeLinePosts } from '../../actions/PostAction';

import {Link} from "react-router-dom"

import {storage} from "../../firebase/firebase"
import { ref, deleteObject } from "firebase/storage"
import { useRef } from 'react'
import { format } from "timeago.js"
import { followUser, unfollowUser } from '../../actions/UserAction'

function Dropdown ({setDropDownSelected, postData, userId}){
    const dispatch = useDispatch();
    const handleDelete = async (e)=>{
        e.preventDefault();
        const data = {
            userId: userId
        }

        let fileRef = null;
        if(postData.image){
            fileRef = ref(storage, `/images/${postData.image.name}`);
        }
        else if(postData.video){
            fileRef = ref(storage, `/videos/${postData.video.name}`);
        }

        if(fileRef){
            deleteObject(fileRef).then(async()=>{
                await deletePost(postData._id, data).then(()=>{
                    toast.success("post deleted successfully", toastParameters);
                    dispatch(getTimeLinePosts(userId));
                });
            });
        }
        else{
            await deletePost(postData._id, data).then(()=>{
                toast.success("post deleted successfully", toastParameters);
                dispatch(getTimeLinePosts(userId));
            });
        }
        
    }
    return (
        <div className="postOperationsOptions">
            {
                postData.userId === userId
                ?
                <>
                    <div onClick={handleDelete}>
                        <DeleteOutline />
                        <span>Delete</span>
                    </div>
                    <div onClick={()=>{setDropDownSelected(false)}}>
                        <EditOutlined />
                        <span>Edit</span>
                    </div>
                </>
                :{}
            }
            
            <div onClick={()=>{setDropDownSelected(false)}}>
                <ShareOutlined />
                <span>Share</span>
            </div>
            
            <div onClick={()=>{setDropDownSelected(false)}}>
                <CloseOutlined />
                <span>Close</span>
            </div>
        </div>
    )
}
const Post = ({data}) => {
    const {user} = useSelector((state)=>state.authReducer.authData);
    const {posts} = useSelector((state)=>state.postReducer);

    const [dropDownSelected, setDropDownSelected] = useState(false);

    const [comment, setComment] = useState(false);
    const [liked, setLiked] = useState(data.likes.includes(user._id)?true:false);
    const [likes, setLikes] = useState(data.likes.length);
    const default_user = {
        firstname: "loading..",
        lastname: "loading..",
        username: "loading.."
    }
    const [postUser, setPostUser] = useState(data.userId === user._id?user:default_user);
    const [profileImage, setProfileImage] = useState(data.userId === user._id?user.profilePicture.url:"https://firebasestorage.googleapis.com/v0/b/socialize-development.appspot.com/o/images%2F1665421366423default_profile.png?alt=media&token=cfe908d9-c0f3-47db-84f1-379a18f2f1a1");

    
     useEffect(() => {
        const getPostUser = async()=>{
            const userData = await getUser(data.userId);
            setPostUser(userData.data);
            setProfileImage(userData.data.profilePicture.url);
        }
        setLiked(data.likes.includes(user._id)?true:false);
        setLikes(data.likes.length);
        getPostUser();

     }, [data, user]);

    const handleLike = ()=>{
        setLiked(!liked);
        likePost(data._id, user._id);
        if(liked){
            setLikes((prev)=>prev-1);
        }
        else{
            setLikes((prev)=>prev+1);
        }
    }
    
    const commentRef = useRef();

    const dispatch = useDispatch();

    const handleComment = ()=>{
        if(commentRef.current.value.length < 1){
            toast.warning("Comment can't be empty", toastParameters);
            return;
        }
        const postComment = {
            comment: commentRef.current.value,
            commenterId: user._id,
        }

        dispatch(addComment(data._id, postComment)).then(()=>{
            dispatch(getTimeLinePosts(user._id));
        });
    }

    const [rows, setRows] = useState(1);

    const [hover, setHover] = useState(false);

    const handleFollow = ()=>{
        if(user.following.includes(postUser._id)){
            dispatch(unfollowUser(postUser._id, user)).then(()=>{
                dispatch(getTimeLinePosts(user._id));
            });
        }
        else{
            dispatch(followUser(postUser._id, user)).then(()=>{
                dispatch(getTimeLinePosts(user._id));
            });
        }
    }
  return (
    <>
    <div className="post" >
         {dropDownSelected && <Dropdown setDropDownSelected={setDropDownSelected} postData={data} userId = {user._id}/>}
        <div className="postTop">
            {/* <img src={process.env.REACT_APP_PUBLIC_FOLDER_IMAGES + postUser.profilePicture} alt=""/> */}
            <img src={profileImage} alt="Loading..."/>
            <Link to={`/profile/${data.userId}`} onMouseOver={()=>setHover(true)} onMouseOut={()=>setHover(false)}>
                <span className='name'>
                    {postUser.firstname} {postUser.lastname}
                </span>
                <span className='username'>@{postUser.username}</span>
            </Link>
            <div className='postTime'>
                {format(data.createdAt)}
            </div> 
            {data.userId === user._id ? <MoreVert onClick={()=>setDropDownSelected(true)}/> : "" }
            {
                hover ? 
                <Link to={`/profile/${postUser._id}`}>
                    <div className="user-profile-card">
                        <div className="user-profile-top">
                            <img className = "profile" src={postUser.profilePicture.url} alt="Loading..." />
                            <img className = "cover" src = {postUser.coverPicture.url} alt="Loading..." />
                        </div>

                        <div className="user-profile-info">
                            <span className='name'>
                                {postUser.firstname} {postUser.lastname}
                            </span>
                            <span className='username'>@{postUser.username}</span>
                        </div>
                        <div className="user-profile-bio">
                            {postUser.bio}
                        </div>
                        <div className="user-profile-follower-info">
                            <span>
                                {postUser.followers.length} 
                                <span className='follower-text'>followers</span>
                            </span>
                            <span>
                                {postUser.following.length}
                                <span className='follower-text'>following</span>
                            </span>
                            <span>
                                {posts.filter((post)=>post.userId === postUser._id).length}
                                <span className='follower-text'>posts</span>
                            </span>
                        </div>
                        <div className="user-profile-follow">
                            {
                                 
                                postUser._id === user._id ? "":
                                <button 
                                    className={!user.following.includes(postUser._id)?'button fc-button':'button fc-button unfollow' }
                                    onClick={handleFollow}
                                >
                                    {!user.following.includes(postUser._id)?"follow":"following"}
                                </button>
                                
                            }
                        </div>
                    </div>
                </Link>   
                : ""
            }
            
        </div>
        <div className="description">
            {data.desc}
        </div>

        {
            // from local server storage
            // data.video?
            // <video controls>
            //     <source src={process.env.REACT_APP_PUBLIC_FOLDER_VIDEO + data.video} type="video/webm" />
            //     <source src={process.env.REACT_APP_PUBLIC_FOLDER_VIDEO + data.video} type="video/mp4" />
            // </video>
            // :<img src={data.image?process.env.REACT_APP_PUBLIC_FOLDER_IMAGES + data.image:""} alt="" />
            
            data.video
            ?<video controls>
                <source src={data.video.url} type="video/webm" />
                <source src={data.video.url} type="video/mp4" />
            </video>
            :<img style={!data.image?{display: "none"}:{}}src={data.image?data.image.url:""} alt="" />
           
        }
        
        
        <div className="postBottom">
            <div className='postReact'>
                <div className="like">
                    {!liked?<FavoriteBorderOutlined onClick={handleLike}/> 
                    : <FavoriteOutlined style={{color: "red"}} onClick={handleLike}/>}
                    <span>{likes} likes</span>
                </div>
                <div className="allComments">
                    <AddCommentOutlined onClick={()=>setComment(!comment)}/>
                    <span>{data.comments.length}</span>
                </div>
                <div className="share">
                    <NearMeOutlined />
                </div>
                
            </div>
            
            
        </div>
        <div style={!comment?{display:"none"}:{}}>
            <PostComment commentData={data.comments} post={data}/>
        </div>
        <div className="newComment">
            <img src={user.profilePicture.url} alt=""/>
            <textarea type="text" name="comment" placeholder='New Comment' ref={commentRef} rows = {rows} onChange={()=>{setRows(Math.max(1, commentRef.current.value?.split("\n").length))}}/>
            <Send onClick={handleComment}/>
        </div>
    </div>
    <ToastContainer />
    </>
  )
}

export default Post