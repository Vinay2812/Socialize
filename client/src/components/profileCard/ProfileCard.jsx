import React, { useRef } from 'react'
import './profileCard.css'
import {CameraAlt, Edit} from "@material-ui/icons"

import {useDispatch, useSelector} from "react-redux";

import {Link, useParams} from "react-router-dom"

// import { uploadImage } from "../../actions/UploadActions"
import { followUser, unfollowUser, updateUser } from '../../actions/UserAction'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { toastParameters } from '../toastParameters';

import { ref, getDownloadURL, uploadBytes, deleteObject} from "firebase/storage";
import { storage } from '../../firebase/firebase';

import { useState } from 'react';
import { useEffect } from 'react';
import { getUser } from '../../api/UserRequest';
import Compressor from 'compressorjs';
import Loader from '../loader/Loader';
import { getTimeLinePosts } from '../../actions/PostAction';

const ProfileCard = ({location}) => {
    const {user} = useSelector((state)=>state.authReducer.authData);
    const {posts} = useSelector((state)=>state.postReducer);

    const params = useParams();

    const [profileUser, setProfileUser] = useState(user);
    const isMyProfile = (params.id === undefined || params.id === user._id)?true:false;

    const [coverImage, setCoverImage] = useState(profileUser.coverPicture.url);
    const [profileImage, setProfileImage] = useState(profileUser.profilePicture.url);

    useEffect(()=>{
        const getProfileUser = async ()=>{
            if(!isMyProfile){    
                const {data} = await getUser(params.id);
                setProfileUser(data);
                setCoverImage(data.coverPicture.url);
                setProfileImage(data.profilePicture.url);
            }
            else{
                setProfileUser(user);
            }
        }
        getProfileUser();
        
    }, [params.id, user])

    const {password, ...formData} = user;

    const profilePage = (location === "profilePage");

    const profileImgRef = useRef();
    const coverImgRef = useRef();

    const dispatch = useDispatch();

    const [uploading, setUploading] = useState(false);

    const uploadImage = (img, target)=>{
        let fileRef = null;
        let userData = formData;
        const filename = Date.now() + img.name;
        const imageRef = ref(storage, `images/${filename}`);
            uploadBytes(imageRef, img).then(()=>{
                getDownloadURL(imageRef).then((url)=>{
                    console.log(url);
                    if(target === "profileImage"){
                        if(userData.profilePicture.name !== process.env.REACT_APP_DEFAULT_PROFILE){
                            fileRef = ref(storage, `/images/${userData.profilePicture.name}`);
                        }
                        
                        userData.profilePicture.url = url;
                        userData.profilePicture.name = filename;
                        setProfileImage(url);
                    }
                    else{
                        if(userData.coverPicture.name !== process.env.REACT_APP_DEFAULT_COVER){
                            fileRef = ref(storage, `/images/${userData.coverPicture.name}`);
                        }

                        userData.coverPicture.url = url;
                        userData.coverPicture.name = filename;
                        setCoverImage(url);
                    }
                    try {
                        if(fileRef){
                            deleteObject(fileRef).then(()=>toast.success(`${target === "profileImage"?"Profile":"Cover"} picture updated successfully`, toastParameters));
                        }
                        dispatch(updateUser(user._id, userData));
                        
                        
                    } catch (err) {
                        console.log(user);
                    } 
                    setUploading(false);
                });   
            });   
    }
    
    const onImageChange = (event)=>{
        if(event.target.files && event.target.files[0]){
            setUploading(true);
            new Compressor(event.target.files[0], {
                quality: 0.4,
                success(image){
                    uploadImage(image, event.target.name)
                }
            });
            
            // const data = new FormData();
            /*  UPLOAD TO LOCAL SERVER
                data.append("name", fileName);
                data.append("file", img);
                if(event.target.name === "profileImage"){
                    userData.profilePicture = fileName;
                }
                else{
                    userData.coverPicture = fileName;
                }
                try {
                    dispatch(uploadImage(data));
                    toast.success(`${event.target.name === "profileImage"?"Profile":"Cover"} picture updated successfully`, toastParameters);
                } catch (err) {
                    console.log(user);
                }
                console.log(userData.coverPicture, userData.profilePicture);
            */
            
            // upload to firebase
            
            
        }
    };

    
    const handleFollow = ()=>{
        if(user.following.includes(params.id)){
            dispatch(unfollowUser(params.id, user)).then(()=>{
                dispatch(getTimeLinePosts(user._id));
            });
        }
        else{
            dispatch(followUser(params.id, user)).then(()=>{
                dispatch(getTimeLinePosts(user._id));
            });
        }
    
    }
    
  return (
     
     <div className="profileCard" style={!profilePage?{width: "calc(100% - 5rem)", marginTop: "0.5rem"}:{}}>
        {uploading ? <Loader /> :
        <>
        <div className="profileImages">
            <img 
                src = {coverImage} 
                alt="" 
                style={{backgroundColor: "var(--black)"}}
            />
            {
                isMyProfile
                ?<Edit onClick={(e)=>{
                    coverImgRef.current.click();
                }}/>
                : ""
            }
            
            <img 
                src = {profileImage}
                alt=""
                style={{backgroundColor: "var(--black)"}}
            />

            {
                isMyProfile 
                ? <CameraAlt onClick={(e)=>{
                        profileImgRef.current.click();
                   }}/>
                : ""
            }

            <div style={{display:"none"}}>
                <input 
                    type="file" 
                    name="profileImage" 
                    ref={profileImgRef} 
                    onChange={onImageChange}
                />
            </div>
            <div style={{display:"none"}}>
                <input 
                    type="file" 
                    name="coverImage" 
                    ref={coverImgRef} 
                    onChange={onImageChange}
                />
            </div>
        </div>
        <div className="profileName">
            <span>{profileUser.firstname} {profileUser.lastname}</span>
        </div>
        <div className="followStatus">
            <hr />
            <div>
            <div className="follow">
                    <span>{profileUser.followers?.length}</span>
                    <span>Followers</span>
                </div>
                <div className="vl"></div>
                <div className="follow">
                    <span>{profileUser.following?.length}</span>
                    <span>Following</span>
                </div>

                {profilePage && (
                    <>
                        <div className="vl"></div>
                        <div className="follow">
                            <span>{posts.filter((post)=>post.userId === profileUser._id).length}</span>
                            <span>Posts</span> 
                        </div>
                    </>
                )}
            </div>
            <hr />
            {
                profilePage && params.id !==user._id ? 
                <button className={user.following.includes(params.id)?"button unfollow-btn" : "button follow-btn"} onClick={handleFollow}>
                    {user.following.includes(params.id)?"Following":"Follow"}
                </button>
                :""
            }
        </div>

        {profilePage? '' : 
            <span >
                <Link to= {`/profile/${user._id}`} style={{textDecoration: "none", color: "inherit"}} >
                    My Profile
                </Link>
            </span>
        }
        </>
    }
     </div>
  )
}

export default ProfileCard