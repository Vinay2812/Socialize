import React from 'react'
import { useState } from 'react'
import "./auth.css"

import { useDispatch, useSelector } from "react-redux"
import { FadeLoader } from "react-spinners"
import { login, register } from '../../actions/AuthAction';
import { useEffect } from 'react';

import {toast, ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { toastParameters } from '../../components/toastParameters';

const handleFormValidation = (data)=>{
    let error = false;
    const onlyChar = /^[A-Za-z]*$/
    const usernameValidity = /^[A-Za-z_]/
    const passwordValidity = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/
    const emailValidity = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    
    if(!onlyChar.test(data.firstname)){
      toast.error("firstname must have only characters", toastParameters);
      error = true;
    }
    if(!onlyChar.test(data.lastname)){
      toast.error("lastname must have only characters", toastParameters);
      error = true;
    }
    if(!usernameValidity.test(data.username)){
      toast.error("username must start with letter or _", toastParameters);
      error = true;
    }
    if(data.firstname.length <= 3){
      toast.error("firstname must have atleast 3 characters", toastParameters);
      error = true;
    }
    if(data.lastname.length <= 3){
      toast.error("lastname must have atleast 3 characters", toastParameters);
      error = true;
    }
    if(data.username.length <= 3){
      toast.error("username must have atleast 3 characters", toastParameters);
      error = true;
    }
    if(!emailValidity.test(data.email)){
      toast.error("please enter valid email", toastParameters);
      error = true;
    }
    // if(!passwordValidity.test(data.password)){
    //   toast.error("password must be combination of digit, lowercase, uppercase and special character", toastParameters);
    //   error = true;
    // }
    if(data.password !== data.confirmpass){
      toast.error("password and confirm password doesn't match", toastParameters);
      error = true;
    }

    return error;
}

const Register = ({setIsRegister, handleChange, handleSubmit, clearForm, data, setPageChanged}) => {
  return (
    <form className="container" onSubmit={handleSubmit}>
        <div className="header">
            REGISTER
        </div>
        <div className="names">
            <input type="text" placeholder='first name' name="firstname" onChange={handleChange} value={data.firstname}/>
            <input type="text" placeholder='last name' name="lastname" onChange={handleChange} value={data.lastname}/>
        </div>
        <div className="username-mobile">
            <input type="text" placeholder="username" name="username" onChange={handleChange} value={data.username}/>
            <input type="email" placeholder="email" name="email" onChange={handleChange} value={data.email}/>
        </div>
        <div className="passwords">
            <input type="password" placeholder='password' name="password" onChange={handleChange} value={data.password}/>
            <input type="password" placeholder='confirm password' name="confirmpass" onChange={handleChange} value={data.confirmpass}/>
        </div>
        <button className="button b-auth">Register</button>
        <div className="bottom" 
             onClick={()=>{
              clearForm();
              setIsRegister(false);
              setPageChanged(true);
            }}
        >
            <span>Already have an account? Login</span>         
        </div>
    </form>
  )
}

const Login = ({setIsRegister, handleChange, handleSubmit, clearForm, data, setPageChanged}) => {
  return (
    <form className="container" style={{width:"25rem"}} onSubmit={handleSubmit}>
        <div className="header">
            LOGIN
        </div>

          <input type="text" placeholder='username' style={{width:"calc(100% - 2rem)"}} name="username" onChange={handleChange} value={data.username}/>
          <input type="password" placeholder='password' style={{width:"calc(100% - 2rem)"}} name="password" onChange={handleChange} value={data.password}/>

        <button className="button b-auth">Login</button>
        <div className="bottom" 
             onClick={()=>{
              clearForm();
              setIsRegister(true);
              setPageChanged(true);
            }}
        >
        <span>Don't have an account? Register</span>
        </div>
    </form>
  )
}

const Auth = () => {
  const [isRegister, setIsRegister] = useState(true);
  const dispatch = useDispatch();
  const {loading, error} = useSelector((state)=>state.authReducer) // -> redux hook to access from global state
  const [pageChanged, setPageChanged] = useState(false); 

  useEffect(()=>{
    if(pageChanged){
      setPageChanged(false);
      return;
    }
    if(error === true){
      if(isRegister){
        toast.warning("Username already exist!!", toastParameters);
      }
      else{
        toast.warning("Invalid username or password!", toastParameters);
      }
    }
    return;
  }, [error, isRegister]);

  const [data, setData] = useState(
    {firstname: "", lastname: "", password: "", confirmpass: "", username: "", email: ""}
  )

  const clearForm = ()=>{
    setData({firstname: "", lastname: "", password: "", confirmpass: "", username: "", email: ""});
  }

  const handleChange = (e)=>{
    setData({...data, [e.target.name]: e.target.value});
  }

  const handleSubmit = async(e)=>{
    e.preventDefault(); 

    if(isRegister){
      const formerror = handleFormValidation(data);
      if(formerror){
        return false;
      }
      else{
        dispatch(register(data));
      }
      
    }
    else{
       dispatch(login(data));
    }
  }

  return (
    <>
   <div className="auth">
   {loading 
     ? <FadeLoader color="#36d7b7" style={{position: "absolute", top: "45%", left:"50%"}}/> 
     :  isRegister 
        ? <Register 
          setIsRegister={setIsRegister} 
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          clearForm = {clearForm}
          data={data}
          setPageChanged = {setPageChanged}
        />
        : <Login 
          setIsRegister={setIsRegister} 
          handleChange={handleChange}
          handleSubmit={handleSubmit} 
          clearForm = {clearForm}
          data = {data}
          setPageChanged = {setPageChanged}
         />
  }
    </div>
    <ToastContainer />
    </>
  )
}

export default Auth