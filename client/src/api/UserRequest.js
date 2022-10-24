import {API} from "./AxiosInstance"

API.interceptors.request.use((req)=>{
    if(localStorage.getItem('profile')){
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
        // console.log(req.headers.Authorization);
    }
    return req;
})

export const getUser = async (userId) => await API.get(`/user/${userId}`);
export const updateUser = async (id, data) => await API.patch(`/user/${id}`, data);
export const getAllUser = async () => await API.get("/user/");
export const followUser = async(id, data) => await API.put(`/user/${id}/follow`, data);
export const unfollowUser = async(id, data) => await API.put(`/user/${id}/unfollow`, data);
export const searchUser = async(data)=> await API.post("user/search", data);