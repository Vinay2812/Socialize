import React, { useRef, useState } from 'react'
import "./rightSide.css"

import TrendCard from '../trendCard/TrendCard'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { toastParameters } from '../toastParameters';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../actions/UserAction';
import Loader from "../loader/Loader"
import {CancelOutlined} from "@material-ui/icons"
const bcrypt = require("bcryptjs");


const RightSide = () => {
  const {user} = useSelector((state)=>state.authReducer.authData);
  const [updatePassword, setUpdatePassword] = useState(false);
  const passRef = useRef();
  const newPassRef = useRef();
  const confirmPassRef = useRef();

  const [pass, setPass] = useState("");
  const dispatch = useDispatch();

  const [updating, setUpdating] = useState(false);

  const passwordValidity = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/

  const handleSubmit = async()=>{
    if(newPassRef.current.value !== confirmPassRef.current.value){
      toast.warning("password and confirm password doesn't match", toastParameters);
      return;
    }
    // if(!passwordValidity.test(newPassRef.current.value)){
    //   toast.error("Password is weak, use combination of characters", toastParameters);
    //   return;
    // }
    setPass(passRef.current.value);

    const match = await bcrypt.compare(passRef.current.value, user.password);

    if(match){
      let data = user;
      data.password = newPassRef.current.value;
      setUpdating(true);
      dispatch(updateUser(user._id, data)).then(()=>{
        setUpdating(false);
        toast.success("password updated successfully");
      });
      
      setUpdatePassword(false);

    }
    else{
      toast.error("Invalid old password", toastParameters);
    }
    
    
  }  
  return (
    <>
    {
      updating 
      ? <Loader />
      : 
      <div className="rightSide">
      
        <TrendCard />

        <button className='button r-button' onClick={()=>setUpdatePassword(true)}>
            Update Password
        </button>
        
    </div>
    }
    {
        updatePassword ? 
        <>
          <div className="blur"></div>
          <div className="updateForm">
            <CancelOutlined onClick={()=>{setUpdatePassword(false);setPass("")}}/>
            <input type="text" className='update-password' ref={passRef} placeholder="password" value={pass} onChange={()=>setPass(passRef.current.value)}/>
            <input type="password" className='new-password'ref={newPassRef} placeholder="new password"/>
            <input type="password" className='update-confirm-password'ref={confirmPassRef} placeholder="confirm password"/>
            <button className="button u-btn" onClick={handleSubmit}>
              Update
            </button>
          </div>
        </>
        : ""
      }
    <ToastContainer />
    </>
  )
}

export default RightSide