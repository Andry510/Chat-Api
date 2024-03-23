//Dependecia de node (jsonwebtoken)
import jwt from "jsonwebtoken"

//Variable de entorno
import { SECRET_TOKEN, EXPIRES_TOKEN } from "../../config/config.js"

//Seguridad
import generateTokens from "../../utils/security/tokenGenerator.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const refreshToken = async (req, res) => {
    try {
        //Extrae el refreshToken del cuerpo
        const { refreshToken } = req.body

        //Verficia que exista el refreshToken
        if (!refreshToken) {
            //Extrae el status, titulo y mensaje
            const { unauthorized } = statusHttp
            const { title, message } = userMessages.unauthorized
            return res.status(unauthorized).json({ title, message })
        }

        //Crea un nuevo token
        jwt.verify(refreshToken, SECRET_TOKEN, (error, user) => {

            //Verifica si ya no es valido
            if (error) {

                //Extrae el status y el mensaje
                const { forbidden } = statusHttp
                const { title, message } = userMessages.refreshTokenExpired
                return res.status(forbidden).json({ title, message })
            }
            
            // Genera un nuevo access token
            const token = generateTokens(user.id, parseInt(EXPIRES_TOKEN))

            // Envía el nuevo access token al cliente
            const { OK } = statusHttp
            const { title, message } = userMessages
            res.status(OK).json({ title, message, token, refreshToken });

        });

    } catch (error) {
        //Extrae el status, titulo y mensaje del error
        const { status, title, message } = error

        return res.status(status || statusHttp.internalServerError).json({
            title: title || errorSystem.systemError.title,
            message
        })
    }
}

export default refreshToken