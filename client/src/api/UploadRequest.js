import {API} from "./AxiosInstance"

export const uploadImage = async (data) => await API.post("/upload/image", data);
export const uploadVideo = async (data) => await API.post("/upload/video", data);
export const uploadPost = async (data) => await API.post("/post/", data);