//Servicios
import { getOneChannel } from "../../services/channel.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const getChannel = async (req, res) => {
    try {
        //Extrae el id del usuario y el id del canal
        const { user: { id }, params: { channelId } } = req

        //Llama a la funcion para obtener el canal
        const channel = await getOneChannel({ userId: id, channelId })

        if (!channel) {
            //Extrae el status, titulo y mensaje
            const { unauthorized } = statusHttp
            const { title, message } = userMessages.unauthorized
            return res.status(unauthorized).json({ title, message })
        }

        //Extrae el status, titulo y mensaje
        const { OK } = statusHttp
        const { title, message } = userMessages.channelFound
        res.status(OK).json({ title, message, channel })

    } catch (error) {
        //Extrae el status, titulo y mensaje del error
        const { status, title, message } = error

        return res.status(status || statusHttp.internalServerError).json({
            title: title || errorSystem.systemError.title,
            message
        })
    }
}

export default getChannel