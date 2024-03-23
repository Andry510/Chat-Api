//Servicios
import { deleteUserAsChannelCreator, deleteUserAsChannelMember } from "../../services/user.js"
import { getChannelById, deleteChannelById } from "../../services/channel.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const deleteChannel = async (req, res) => {
    try {
        //Extrae el id del usuario y el id del canal
        const { user: { id }, params: { channelId } } = req

        //Llama a la funcion para btener el canal
        const channel = await getChannelById(channelId)

        //Verifica sino existe el canal
        if (!channel) {
            //Extrae el status, titulo y mensaje
            const { notFound } = statusHttp
            const { title, message } = userMessages.channelNotFound
            return res.status(notFound).json({ title, message })
        }

        //Valida y verifica si el usuario es el creador del canal
        const isCreator = channel.creatorUserID == id
        if (!isCreator) {
            //Extrae el status, titulo y mensaje
            const { unauthorized } = statusHttp
            const { title, message } = userMessages.unauthorized
            return res.status(unauthorized).json({ title, message })
        }

        //Recorre los miembros obteniendo su id y eliminandolo
        channel.members.forEach(async ({ member }) => {
            await deleteUserAsChannelMember(member, channelId)
        })

        //Elimina el id del 
        await deleteUserAsChannelCreator(id, channelId)

        //Llama a la funcion para eliminar el canal
        await deleteChannelById(channelId)

        //Extrae el status, titulo y mensaje
        const { noContent } = statusHttp
        const { title, message } = userMessages.channelDeleted
        res.status(noContent).json({ title, message })
    } catch (error) {
        //Extrae el status, titulo y mensaje del error
        const { status, title, message } = error
        return res.status(status || statusHttp.internalServerError).json({
            title: title || errorSystem.systemError.title,
            message
        })
    }
}

export default deleteChannel