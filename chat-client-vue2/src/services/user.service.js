import {getRequest} from "@/services/axios.service";

async function getCurrentUser(){
    const res = await getRequest('/api/current_user', 'getCurrentUser', {withCredentials: true})

    return res;
}



export{
    getCurrentUser,
}