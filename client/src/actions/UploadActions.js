import * as UploadApi from "../api/UploadRequest"

export const uploadImage = (data) =>{
    return async(dispatch) => {
        try {
            return await UploadApi.uploadImage(data);
        } catch (err) {
            console.log("uploadActions -> uploadImage -> "+ err);
        }
    }
}
export const uploadVideo = (data) =>{
    return async(dispatch) => {
        try {
            return await UploadApi.uploadVideo(data);
        } catch (err) {
            console.log("uploadActions -> uploadVideo -> "+ err);
        }
    }
}

export const uploadPost = (data) => {
    return async(dispatch) =>{
        dispatch({type: "UPLOAD_START"})
        try {
            const newPost = await UploadApi.uploadPost(data);
            dispatch({type: "UPLOAD_SUCCESSFULL", data: newPost.data})
        } catch (err) {
            dispatch({type: "UPLOAD_FAIL"})
            console.log("uploadActions -> uploadPost -> "+err);
        }
    }
}