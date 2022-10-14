import * as AuthApi from "../api/AuthRequest" 

export const login = (formData) => {
    return async(dispatch) => {
        dispatch({type: "AUTH_START"});
        try {
            const {data} = await AuthApi.login(formData);
            dispatch({type: "AUTH_SUCCESS", data: data});
        } catch (err) {
            console.log(err);
            dispatch({type: "AUTH_FAILED"});
        }
        
    }
}

export const register = (formData)=> {
    return async(dispatch) =>{
        dispatch({type: "AUTH_START"});
        try {
            const {data} = await AuthApi.register(formData);
            dispatch({type: "AUTH_SUCCESS", data: data});
        } catch (err) {
            console.log(err);
            dispatch({type: "AUTH_FAILED"})
        }
    }
}


export const logout = () => {
    return async(dispatch) => {
        dispatch({type: "LOG_OUT"})
    }
}

