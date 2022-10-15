import React, { useEffect, useState } from 'react'
import "./post.css"
import { FavoriteBorderOutlined, FavoriteOutlined, MoreVert, DeleteOutline, ShareOutlined, EditOutlined, CloseOutlined, AddCommentOutlined, NearMeOutlined, Send } from "@material-ui/icons"

import PostComment from '../postComment/PostComment'
import { useDispatch, useSelector } from 'react-redux'
import { deletePost, likePost } from '../../api/PostRequest'
import { getUser } from '../../api/UserRequest'

import {toast, ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { toastParameters } from '../../components/toastParameters';

import { addComment, getTimeLinePosts } from '../../actions/PostAction'

import {Link} from "react-router-dom"

import {storage} from "../../firebase/firebase"
import { ref, deleteObject } from "firebase/storage"
import { useRef } from 'react'
import { format } from "timeago.js"

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

    const [postUser, setPostUser] = useState({});
    const [profileImage, setProfileImage] = useState("");

    
     useEffect(() => {
        const getPostUser = async()=>{
            const userData = await getUser(data.userId);
            setPostUser(userData.data);
            setProfileImage(userData.data.profilePicture.url);
        }
        setLiked(data.likes.includes(user._id)?true:false);
        setLikes(data.likes.length);
        getPostUser();

     }, [data, user, posts]);

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

  return (
    <>
    <div className="post" >
         {dropDownSelected && <Dropdown setDropDownSelected={setDropDownSelected} postData={data} userId = {user._id}/>}
        <div className="postTop">
            {/* <img src={process.env.REACT_APP_PUBLIC_FOLDER_IMAGES + postUser.profilePicture} alt=""/> */}
            <img src={profileImage} alt=""/>
            <Link to={`/profile/${data.userId}`}>
                <span className='name'>
                    {postUser.firstname} {postUser.lastname}
                </span>
                <span className='username'>@{postUser.username}</span>
            </Link>
            <div className='postTime'>
                {format(data.createdAt)}
            </div> 
            {data.userId === user._id ? <MoreVert onClick={()=>setDropDownSelected(true)}/> : "" }
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