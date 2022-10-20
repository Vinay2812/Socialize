import {API} from "./AxiosInstance"

// API.interceptors.request.use((req)=>{
//     if(localStorage.getItem('profile')){
//         req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
//         // console.log(req.headers.Authorization);
//     }
//     return req;
// })

export const getUser = async (userId) => await API.get(`/user/${userId}`);
export const updateUser = async (id, data) => await API.patch(`/user/${id}`, data);
export const getAllUser = async () => await API.get("/user/");
export const followRequest = async(id, data) => await API.put(`/user/${id}/request`, data);
export const cancelFollowRequest = async(id, data) => await API.put(`/user/${id}/cancel`, data);
export const acceptFollowRequest = async(id, data) => await API.put(`/user/${id}/accept`, data);
export const rejectFollowRequest= async(id, data) => await API.put(`/user/${id}/reject`, data);
export const unfollowUser = async(id, data) => await API.put(`/user/${id}/unfollow`, data);