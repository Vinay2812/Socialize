import React, {useState, useRef} from 'react'
import "./postShare.css"

import { PlayCircleOutline,  CancelOutlined, AddPhotoAlternateOutlined, AddLocationOutlined, Bookmarks} from "@material-ui/icons"
import {useDispatch, useSelector} from "react-redux"
import { uploadPost } from '../../actions/UploadActions'
// import { uploadImage, uploadPost, uploadVideo } from '../../actions/UploadActions'

import Compressor from 'compressorjs';
import { toast } from 'react-toastify'
import { toastParameters } from '../toastParameters'
import 'react-toastify/dist/ReactToastify.css';

import { getTimeLinePosts } from '../../actions/PostAction'

import { ref, getDownloadURL, uploadBytes} from "firebase/storage";
import { storage } from '../../firebase/firebase';

import Loader from '../loader/Loader'
import { useParams } from 'react-router-dom'


const ShareOptions = ({handleSubmit, setIsPublicPost, reset})=>{
    return (
        <div className='shareContainer'>
            <div className='shareHeader'>
                How do you want to share your post
                
            </div>
            <div className="shareOptions">
                <div className="shareOption">
                    <input 
                        type="radio" 
                        name="public-private-post" 
                        id="publicPost" 
                        onChange={()=>setIsPublicPost(true)}
                    />
                    <label htmlFor="publicPost">In Public</label>
                </div>
                
                <div className="shareOption">
                    <input 
                        type="radio" 
                        name="public-private-post" 
                        id="privatePost" 
                        onChange={()=>setIsPublicPost(false)}
                        defaultChecked={true}
                    />
                    <label htmlFor="privatePost">In Private</label>
                </div>
                <button className='button ps-button' onClick={handleSubmit} >Share</button>
                
            </div>

            
        </div>
    )
}

const PostShare = ({setPostShare}) => {
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);

    const imageRef = useRef();
    const videoRef = useRef();

    const {user} = useSelector((state)=>state.authReducer.authData)
    const descRef = useRef();
    const dispatch = useDispatch();

    const [isPublicPost, setIsPublicPost] = useState(true);

    const reset = () =>{
        setPostShare(false);
        setImage(null);
        setVideo(null);
        setRows(1);
        descRef.current.value = "";
    }


    const onImageChange = (event)=>{
        if(event.target.files && event.target.files[0]){
            new Compressor(event.target.files[0], {
                quality: 0.4,
                success(img){
                    setImage(img);
                }
            })
            
        }
    }

    const onVideoChange = (event)=>{
        if(event.target.files && event.target.files[0]){
            setVideo(event.target.files[0]);
        }
    }
    const [postUpload, setPostUpload] = useState(null);
    let newPost = null;

    const handleSubmit = (e)=>{
        e.preventDefault();
        setPostUpload(true);
        newPost = {
            userId: user._id,
            desc: descRef.current.value,
            isPublicPost: isPublicPost
        }
        let imageRef = null, videoRef = null, filename = null;
        if(image){
            filename = Date.now() +  image.name;
            imageRef = ref(storage, `images/${filename}`);
            
        }
        else if(video){
            filename = Date.now() +  video.name;
            videoRef = ref(storage, `videos/${filename}`);
        }
        // console.log(newPost);

        //store in local server
        // if(image){
        //     const data = new FormData();
        //     const filename = Date.now() + image.name; // for unique name
        //     data.append("name", filename);
        //     data.append("file", image);
        //     newPost.image = filename;
        //     try {
        //         dispatch(uploadImage(data));
        //     } catch (err) {
        //         console.log(err);
        //     }
        // }
        // else if(video){
        //     const data = new FormData();
        //     const filename = Date.now() + video.name; // for unique name
        //     data.append("name", filename);
        //     data.append("file", video);
        //     newPost.video = filename;
        //     try {
        //         dispatch(uploadVideo(data));
        //     } catch (err) {
        //         console.log(err);
        //     }
        // }

        if(newPost.desc.length > 0){
            if(image || video){
                uploadBytes(image?imageRef:videoRef, image || video).then(()=>{
                    getDownloadURL(image?imageRef:videoRef).then((url)=>{
                        if(image){
                            newPost.image = {
                                name: filename,
                                url: url
                            }
                        }
                        else{
                            newPost.video = {
                                name: filename,
                                url: url
                            }
                        }
                        dispatch(uploadPost(newPost));
                        dispatch(getTimeLinePosts(user._id));
                        setPostUpload(false);
                        reset();
                    });
                });
            }
            else{
                dispatch(uploadPost(newPost));
                dispatch(getTimeLinePosts(user._id));
                setPostUpload(false);
                reset();
            }
            
        }
        else{
            toast.warning("Description can't be empty!", toastParameters);
            setPostUpload(false);
        }
        
    }
    const [rows, setRows] = useState(4);
    const handleDesc = ()=>{
        setRows(descRef.current.value.split("\n").length);
    }
    const params = useParams();
    const isMyProfile = (params.id === undefined || params.id === user._id)?true:false;
  return (
    <>
    {(postUpload === true)
    ? <Loader />
    : isMyProfile
        ?   <div className="postShare">
                <CancelOutlined onClick={()=>{
                    reset();
                }}/>
                <div className="postShare-left">
                    <div className="postShare-option active"
                        onClick={()=>imageRef.current.click()}
                    >
                        <div className='sphere'></div>
                        <AddPhotoAlternateOutlined />
                        <span>Add Image</span>
                    </div>
                    <div className="postShare-option active"
                        onClick={()=>videoRef.current.click()}
                    >
                        <div className="sphere"></div>
                        <PlayCircleOutline/>
                        <span>Add Video</span>
                    </div>
                    <div className="postShare-option active">
                        <div className="sphere"></div>
                        <Bookmarks />
                        <span>Tag people</span>
                    </div>
                    <div className="postShare-option active">
                        <div className="sphere"></div>
                        <AddLocationOutlined />
                        <span>Add Location</span>
                    </div>
                    <div style={{display:"none"}}>
                        <input 
                            type="file" 
                            name="image"
                            ref={imageRef} 
                            onChange={onImageChange}
                            onClick={(event)=>{
                                event.target.value = null;
                            }}
                        />
                    </div>
                    <div style={{display:"none"}}>
                        <input 
                            type="file" 
                            name="video"
                            ref={videoRef} 
                            onChange={onVideoChange}
                            onClick={(event)=>{
                                event.target.value = null;
                            }}
                        />
                    </div>
                </div>
                
                <div className='postShare-right'>
                    <textarea 
                            type="text" 
                            placeholder="Write post description"
                            ref={descRef}
                            rows={rows}
                            onChange = {handleDesc}
                            required
                    />
                    
                    {image && (
                            <div className="previewImage">
                                <CancelOutlined
                                    onClick={()=>setImage(null)}
                                />
                                <img src={URL.createObjectURL(image?image:"")} alt=""/>
                            </div>
                    )}
                    {video && (
                            <div className="previewImage">
                                <CancelOutlined
                                    onClick={()=>setVideo(null)}
                                    style={{zIndex: "1000"}}
                                />
                                <video controls style={{width:"100%"}}>
                                    <source src={URL.createObjectURL(video)} type="video/webm" />
                                    <source src={URL.createObjectURL(video)} type="video/mp4" />
                                </video>   
                            </div>
                    )}
                    
                    <ShareOptions 
                        handleSubmit={handleSubmit} 
                        reset = {reset}
                        setIsPublicPost = {setIsPublicPost}
                    />
                    
                    
                </div>
            
            </div>
        : ""
    }
    
    </>
  )
}

export default PostShare
