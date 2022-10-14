import {API} from "./AxiosInstance"

export const login = async (formData) => await API.post("/auth/login", formData);
export const register = async (formData) => await API.post("/auth/register", formData);

