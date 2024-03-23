//Socket
import { io } from "../../app.js"

//Servicios
import { getChannelById, updateMember } from "../../services/channel.js"
import { addUserAsChannelMember } from "../../services/user.js"
import { addMessage } from "../../services/chat.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const addUserToPublicChannel = async (req, res) => {
    try {

        //Extrae el id del usuario y el id del usuario(si se agrega) y del canal del cuerpo
        const { user: { id, name }, body: { channelId } } = req

        //Llama a la funcion para obtener el usuario 
        const channel = await getChannelById(channelId)

        //Verifica sino existe el canal
        if (!channel) {
            //Extrae el status, titulo y mensaje
            const { notFound } = statusHttp
            const { title, message } = userMessages.channelNotFound
            return res.status(notFound).json({ title, message })
        }

        //Valida y verifica si el usuario es el creador
        const isPrivate = channel.type === 'private'
        if (isPrivate) {
            //Extrae el status, titulo y mensaje
            const { conflict } = statusHttp
            const { title, message } = userMessages.privateChannel
            return res.status(conflict).json({ title, message })
        }

        //Valdia si el usuario es el creador o miembro del grupo
        const isCreator = channel.creatorUserID == id
        const isMember = channel.members.some(member => member.member == id);

        //Vefica si, si es el creador o miembro del canal
        if (isCreator || isMember) {
            //Extrae el status, titulo y mensaje
            const { conflict } = statusHttp
            const { title, message } = userMessages.memberOrCreatorExists
            return res.status(conflict).json({ title, message })
        }

        //Llama a la funcion para guardar al usuario
        await updateMember({ idChannel: channelId, member: id })

        await addUserAsChannelMember(id, channelId)

        //Creo objeto con información del usuario y un mensaje
        const userInfo = { userId: id, userName: name }
        const messageCreate = {
            userInfo,
            messageContent: `${name} has joined the channel`
        }

        //Llamo a la funcion para mandarlo guardarlo en la base de datos
        const messageSaved = await addMessage(channelId, messageCreate)

        //Manda el mensaje al grupo
        io.to(channelId).emit("channel-message", messageSaved)

        //Extrae status, titulo y mensaje
        const { OK } = statusHttp
        const { title, message } = userMessages.member
        res.status(OK).json({ title, message })
    } catch (error) {
        //Extrae el status, titulo y mensaje del error
        const { status, title, message } = error

        return res.status(status || statusHttp.internalServerError).json({
            title: title || errorSystem.systemError.title,
            message
        })
    }
}

export default addUserToPublicChannel