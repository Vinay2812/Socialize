import * as UserApi from "../api/UserRequest"

export const updateUser = (id, formData) => {
    return async(dispatch)=>{
        dispatch({type: "UPDATING_START"});
        try {
            const {data} = await UserApi.updateUser(id, formData)
            dispatch({type: "UPDATING_SUCCESS", data: data});
        } catch (err) {
            dispatch({type: "UPDATING_FAIL"});
        }
    }
}

export const followUser = (id, data) =>{
    return async(dispatch)=>{
        dispatch({type: "FOLLOW_USER", data: id})
        await UserApi.followUser(id, data);
    }
}

export const unfollowUser = (id, data) =>{
    return async(dispatch)=>{
        dispatch({type: "UNFOLLOW_USER", data: id})
        await UserApi.unfollowUser(id, data);
    }
}