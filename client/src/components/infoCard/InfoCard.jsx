import React, { useMemo, useRef, useState } from 'react'
import "./infoCard.css"
import { CancelOutlined } from '@material-ui/icons'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { toastParameters } from '../toastParameters';

import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { useEffect } from 'react';

import * as UserApi from "../../api/UserRequest"
import { updateUser } from '../../actions/UserAction';



const InfoCard = () => {

    const {user} = useSelector((state)=>state.authReducer.authData);

    const dispatch = useDispatch();
    const params = useParams();

    const bioRef = useRef();

    const {password, ...other} = user;
    const [formData, setFormData] = useState(other);

    const profileUserId = params.id;

    const [profileUser, setProfileUser] = useState(formData);

    const [edit, setEdit] = useState(false);
    const [rows, setRows] = useState(user.bio.split("\n").length);

    const prevFormData = useMemo(()=>formData, [edit]);

    const handleBio = (e)=>{
        setRows(Math.min(bioRef.current.value.split("\n").length, 15));
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleSubmit = () => {
        setEdit(false);
        // console.log(formData);
        dispatch(updateUser(user._id, formData));
        toast.success("Profile updated successfully", toastParameters);
    }

    const isMyProfile = (profileUserId === user._id)?true:false;

    useEffect(()=>{
        const fetchProfileUser = async () => {
            if(!isMyProfile){
                const {data} = await UserApi.getUser(profileUserId);
                setProfileUser(data);
            }
        }
        if(isMyProfile)return;
        fetchProfileUser();
    }, [params.id, edit]);

  return (
    <div className="infoCard">
        <div className="infoHead">
            <span>Profile Info</span>
            {
                isMyProfile
                ?<>
                    <CancelOutlined 
                        style={!edit?{display:"none"}:{}} 
                        onClick = {()=>{
                            setEdit(false);
                            setFormData(prevFormData);
                            setRows(prevFormData.bio.split("\n").length);
                            toast.warning("Profile Details not updated", toastParameters)
                        }} 
                    />
                </>
                : ""
            }
            
        </div>
        <div className="info info-name" >
            <input value={(isMyProfile?formData:profileUser).firstname} readOnly={!edit} style={!edit?{border: "none"}:{padding:"4px 8px", textAlign: "start", width: "50%"}} name="firstname" onSubmit={handleSubmit}/>
            <input value={(isMyProfile?formData:profileUser).lastname} readOnly={!edit}  style={!edit?{border: "none"}:{padding:"4px 8px", width: "50%"}} name="lastname" onChange={handleChange}/>
        </div>                                   
        <div className="info">
            <span>
                <b>Status</b>
            </span>
            <input value={(isMyProfile?formData:profileUser).relationship} readOnly={!edit} name="relationship" onChange={handleChange}/>
        </div>

        <div className="info">
            <span>
                <b>Lives in</b>
            </span>
            <input value={(isMyProfile?formData:profileUser).livesin} readOnly={!edit} name="livesin" onChange={handleChange}/>
        </div>

        <div className="info">
            <span>
                <b>Works at</b>
            </span>
            <input value={(isMyProfile?formData:profileUser).worksAt} readOnly={!edit} name="worksAt" onChange={handleChange}/>
        </div>
        <div className="info">
            <span>
                <b>Bio</b>
            </span>
            <textarea rows={rows} ref={bioRef} onChange={handleBio} readOnly={!edit} value={(isMyProfile?formData:profileUser).bio} name="bio" />
        </div>
        {isMyProfile
            ?<button 
                className="button info-button" 
                onClick={()=>{
                    if(edit){
                        handleSubmit();
                    }
                    setEdit(!edit);
                }}
            >
                {!edit?"Edit":"Save"}
            </button>
            :""
        }
    </div>
  )
}

export default InfoCard