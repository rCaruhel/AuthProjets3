import {getRequest, postRequest} from "@/services/axios.service";

async function getCurrentUser(){
    const res = await getRequest('/api/current_user', 'getCurrentUser', {withCredentials: true})

    return res;
}

async function registerUser(user){
    const res = await postRequest('/api/register', user, 'registerUser',{withCredentials: true, data: user})
    return res;
}

async function loginUser(user){
    const res = await postRequest('/api/login', user, 'loginUser',{withCredentials: true, data: user})
    return res;
}


export{
    getCurrentUser,
    registerUser,
    loginUser
}