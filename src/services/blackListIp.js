import blackList from "../models/blackListIp.js";

//Funcion para agregar a la base de datos
export const addToBlacklist = async (ip) => {
    try {

        await blackList.create({ ip });

    } catch (error) {

        //Error
        throw error
    }
}

//Función para verificar si la dirección IP del usuario está en la lista de IPs reportadas.
export const checkBlacklistIP = async (ip) => {
    try {

        //Busca el ip del usuario 
        const isIPInBlacklist = await blackList.findOne({ ip }).select('-_id -createdAt');

        return isIPInBlacklist ? false : true;

    } catch (error) {
        //Error
        throw error
    }
}