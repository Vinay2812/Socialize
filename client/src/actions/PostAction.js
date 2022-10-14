import * as PostApi from "../api/PostRequest" 

export const getTimeLinePosts = (userId) =>{
    return async (dispatch)=>{
        dispatch({type: "RETREVING_START"});
        try {
            const {data} = await PostApi.getTimeLinePosts(userId);
            dispatch({type: "RETREVING_SUCCESS", data: data});
        } catch (err) {
            dispatch({type: "RETREVING_FAIL"});
            console.log(err);
        }
    }
}

export const addComment = (postId, comment)=>{
    return async(dispatch) =>{
        try {
            await PostApi.addComment(postId, comment);
        } catch (err) {
            console.log(err);
        }
    }
}
export const deleteComment = (postId, comment)=>{
    return async(dispatch) =>{
        try {
            await PostApi.deleteComment(postId, comment);
        } catch (err) {
            console.log(err);
        }
    }
}


