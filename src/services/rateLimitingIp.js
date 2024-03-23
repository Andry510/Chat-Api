//Servicios
import rateLimitingIp from "../models/RateLimitingIp.js";

//Funcion para crear un nuevo Ip
export const addIp = async (ip) => {
    try {

        await rateLimitingIp.create({ ip })

    } catch (error) {

        //Error
        throw error;

    }
}

//Funcion para obtener el conteo de intentos
export const getCountIp = async (ip) => {
    try {

        
        const attempts = await rateLimitingIp.findOne({ ip }).select('-_id -ip -createdAt')
        
        return attempts ? attempts.count : null

    } catch (error) {

        //Error
        throw error;
    }
}

export const updateCountIp = async (ip, count) => {
    try {

        await rateLimitingIp.findOneAndUpdate({ ip }, { $set: { count: (count + 1) } })

    } catch (error) {
        //Error
        throw error;
    }
}