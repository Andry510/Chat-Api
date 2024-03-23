//Servicios
import { updateUser } from "../../services/user.js"
//Variables de entorno
import { EXPIRES_TOKEN, EXPIRES_REFRESH_TOKEN } from "../../config/config.js"

//Generadores de token y de UUUID
import generateTokens from "../../utils/security/tokenGenerator.js"
import uuidRefreshTokenGenerator from "../../utils/security/uuidRefreshTokenGenerator.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"


// Función para iniciar sesión del usuario
const SingIn = async (req, res) => {
    try {
        //Extrae el id del usuario
        const { id } = req.user

        //Obtiene el uui del token
        const uuidRefreshToken = uuidRefreshTokenGenerator()

        //Genera tokens de acceso para la aplicación
        const token = generateTokens(id, parseInt(EXPIRES_TOKEN))
        const refreshToken = generateTokens(id, parseInt(EXPIRES_REFRESH_TOKEN))

        //Actualiza el uuid del refresh token
        await updateUser(id, uuidRefreshToken)

        //Extrae el status, titulo y mensaje
        const { OK } = statusHttp
        const { title, message } = userMessages.loginSuccess
        res.status(OK).json({
            title,
            message,
            token,
            refreshToken
        })

    } catch (error) {

        //Extrae el status, titulo y mensaje del error
        const { status, title, message } = error

        return res.status(status || statusHttp.internalServerError).json({
            title: title || errorSystem.systemError.title,
            message
        })
    }
}

export default SingIn