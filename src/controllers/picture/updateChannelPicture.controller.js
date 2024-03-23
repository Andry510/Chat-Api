//Cloudinary
import Cloudinary from "../../connections/cloudinary.js"

//Servicios
import { getChannelById, updateChannelById } from "../../services/channel.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const updateChannelPicture = async (req, res) => {
    try {
        //Extrae el usuario
        const { user, file, params: { channelId } } = req

        //Verifica sino existe el archivo
        if (!file) {
            //Extrae el status, titulo y mensaje
            const { conflict } = statusHttp
            const { title, message } = userMessages.fileNotExist
            return res.status(conflict).json({ title, message })
        }

        //Llama a la funcion para obtener el canal
        const channel = await getChannelById(channelId)

        //Verifica sino existe el canal
        if (!channel) {
            //Extrae el status, titulo y mensaje
            const { notFound } = statusHttp
            const { title, message } = userMessages.fileNotExist
            return res.status(notFound).json({ title, message })
        }

        //Valida y verifica si es el creador del canal
        const isCreator = channel.creatorUserID == user.id
        if (!isCreator) {
            const { unauthorized } = statusHttp
            const { title, message } = userMessages.unauthorized
            return res.status(unauthorized).json({ title, message })
        }

        //Llama a la funcion para obtener la url
        const url = await Cloudinary(file.path, 'channels', channel.name)

        //Crea un objeto
        const dataPicture = { pictureUrl: url }

        //Llama a la funcion para cambiar el canal
        await updateChannelById(channelId, dataPicture)

        //Extrae el status, titulo y mensaje
        const { OK } = statusHttp
        const { title, message } = userMessages.profileUpdated
        res.status(OK).json({ title, message, url })
    } catch (error) {
        //Extrae el status, titulo y mensaje del error
        const { status, title, message } = error

        return res.status(status || statusHttp.internalServerError).json({
            title: title || errorSystem.systemError.title,
            message
        })
    }
}

export default updateChannelPicture