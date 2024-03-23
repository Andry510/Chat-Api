//Servicios
import { addIp, getCountIp, updateCountIp } from "../../services/RateLimitingIp.js"
import { checkBlacklistIP, addToBlacklist } from "../../services/blackListIp.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import messagesSystem from "../../messages/system.js"

//Middleware de control de ip
const ipControlMiddleware = async (req, res, next) => {
    try {

        //Extrae el ip del objeto
        const { ip } = req

        //Llama a la funcion para saber si el id esta en la base de datos
        const isIPBlacklisted = await checkBlacklistIP(ip)

        //Verifica si esta en la lista negra
        if (!isIPBlacklisted) {

            //Extrae el status, titulo y mensaje de los objetos
            const { forbidden } = statusHttp
            const { title, message } = messagesSystem.ipBlocked
            return res.status(forbidden).json({ title, message })
        }

        //Llama a la funcion para obtener el numero de intentos que realizo
        const attempts = await getCountIp(ip)

        //Verifica que el ip no existe
        if (!attempts) {
            //agrega el ip
            await addIp(ip)
        }

        //Verifica si los limites de peticiones a la api
        if (attempts >= 100) {

            //Llama a la funcion para saber si el id esta en la base de datos
            const isIPBlacklisted = await checkBlacklistIP(ip)

            //Verifica si esta en la lista negra
            if (!isIPBlacklisted) {

                //Extrae el status, titulo y mensaje de los objetos
                const { forbidden } = statusHttp
                const { title, message } = messagesSystem.ipBlocked
                return res.status(forbidden).json({ title, message })
            }

            await addToBlacklist(ip)
        }

        //Actualiza el contador
        await updateCountIp(ip, attempts)

        next()

    } catch (error) {

        next(error)
    }
}

export default ipControlMiddleware