import {API} from "./AxiosInstance"
export const getTimeLinePosts = async (userId) => await API.get(`/post/${userId}/timeline`);
export const getPost = async (postId) => await API.get(`/post/${postId}`);
export const likePost = async (postId, userId) => await API.put(`/post/${postId}/like`, {userId: userId});
export const deletePost = async (postId, data) => await API.delete(`/post/${postId}`, {data});
export const addComment = async(postId, comment) => await API.put(`/post/${postId}/comment`, comment);
export const deleteComment = async(postId, comment) => await API.put(`/post/${postId}/uncomment`, comment);