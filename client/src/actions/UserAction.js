import * as UserApi from "../api/UserRequest"

export const updateUser = (id, formData) => {
    return async(dispatch)=>{
        dispatch({type: "UPDATING_START"});
        try {
            console.log(formData);
            const {data} = await UserApi.updateUser(id, formData);
            
            dispatch({type: "UPDATING_SUCCESS", data: data});
        } catch (err) {
            dispatch({type: "UPDATING_FAIL"});
        }
    }
}

export const followRequest = (id, data) =>{
    return async(dispatch)=>{
        dispatch({type: "FOLLOW_REQUEST", data: id})
        await UserApi.followRequest(id, data);
    }
}
export const cancelFollowRequest = (id, data) =>{
    return async(dispatch)=>{
        dispatch({type: "CANCEL_REQUEST", data: id})
        await UserApi.cancelFollowRequest(id, data);
    }
}
export const acceptFollowRequest = (id, data) =>{
    return async(dispatch)=>{
        await UserApi.acceptFollowRequest(id, data);
        dispatch({type: "ACCEPT_REQUEST", data: id})
        
    }
}
export const rejectFollowRequest = (id, data) =>{
    return async(dispatch)=>{
        dispatch({type: "REJECT_REQUEST", data: id})
        await UserApi.rejectFollowRequest(id, data);
    }
}

export const unfollowUser = (id, data) =>{
    return async(dispatch)=>{
        dispatch({type: "UNFOLLOW_USER", data: id})
        await UserApi.unfollowUser(id, data);
    }
}