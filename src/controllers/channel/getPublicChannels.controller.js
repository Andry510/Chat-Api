//Servicios
import { getAllPublicChannels } from "../../services/channel.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const getPublicChannels = async (req, res) => {
    try {

        const channels = await getAllPublicChannels()

        //Verifica si contiene canales
        if (channels.length === 0) {
            //Extrae el status            
            const { noContent } = statusHttp
            const { title, message } = userMessages.channelNotFound
            return res.status(noContent).json({ title, message })
        }

        //Extrae el status, titulo y mensaje
        const { OK } = statusHttp
        const { title, message } = userMessages.channelFound
        res.status(OK).json({ title, message, channels })
        
    } catch (error) {
        //Extrae el status, titulo y mensaje del error
        const { status, title, message } = error

        return res.status(status || statusHttp.internalServerError).json({
            title: title || errorSystem.systemError.title,
            message
        })
    }
}
export default getPublicChannels