import axios from 'axios'

const axiosAgent = axios.create({
    baseURL : 'http://localhost:3000'
})

axiosAgent.interceptors.request.use(config =>{
    try{
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }catch(error){
        return Promise.reject(error);
    }
})


function handleError(serviceName,err){
    if(err.response){
        console.error(`Error from ${serviceName} : ${err.response.status} ${err.response.statusText}`)

        return {
            data: {
                error: 1,
                data: err.response.data
            }
        }
    }
    if (err.request){
        console.log("NETWORK ERROR while calling SERVICE "+serviceName+ ": " + JSON.stringify(err.request));
        // on retourne un objet qui a la même structure qu'une réponse normale sans erreur.
        // mais avec un champ data contenant un message
        return {
            data: {
                error: 1,
                data: 'Le serveur est injoignable ou l\'URL demandée n\'existe pas'
            }
        };
    }
    else {
        // tout autre cas
        console.log("UNKNOWN ERROR while calling SERVICE "+serviceName);
        // on retourne un objet qui a la même structure qu'une réponse normale sans erreur.
        // mais avec un champ data contenant un message
        return {
            data: {
                error: 1,
                data: 'Erreur inconnue'
            }
        };
    }
}


async function getRequest(uri, name, config = {}) {
    let response = null
    try {
        response = await axiosAgent.get(uri, config)
    } catch (err) {
        // le catch se fait si le serveur répond avec une erreur type 4XX, 5XX, ou bien si le serveur est off
        // dans ce cas, on appelle la méthode pour traiter ces types d'erreurs et on met le résutlat dans response.
        response = handleError(name, err);
    }
    // on retourne les données dans response, qu'il y ait eu une erreur ou pas.
    return response.data;
}



async function postRequest(uri, data, name, config = {}) {
    let response = null
    try {
        response = await axiosAgent.post(uri, data, config)
    } catch (err) {
        // le catch se fait si le serveur répond avec une erreur type 4XX, 5XX, ou bien si le serveur est off
        // dans ce cas, on appelle la méthode pour traiter ces types d'erreurs
        response = handleError(name, err);
    }
    // on retourne les données dans response, qu'il y ait eu une erreur ou pas.
    return response.data;
}


async function patchRequest(uri, data, name, config={}) {
    let response = null
    try {
        response = await axiosAgent.patch(uri, data, config)
    } catch (err) {
        // le catch se fait si le serveur répond avec une erreur type 4XX, 5XX, ou bien si le serveur est off
        // dans ce cas, on appelle la méthode pour traiter ces types d'erreurs
        response = handleError(name, err);
    }
    // on retourne les données dans response, qu'il y ait eu une erreur ou pas.
    return response.data;
}


export {
    getRequest,
    postRequest,
    patchRequest,
}

