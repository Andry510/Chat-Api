//Socket
import { io } from "../../app.js"

//Servicios
import { getChannelById, updateMember } from "../../services/channel.js"
import { getUserById, addUserAsChannelMember } from "../../services/user.js"
import { addMessage } from "../../services/chat.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const addUserToPrivateChannel = async (req, res) => {
    try {
        //Extrae el id y nombre del usuario y extrae el id del canal y del usuario(que se agregara como miembro)
        const { user: { id, name }, body: { channelId, userId } } = req

        //Llama a las funciones para obtener el canal y el usuario
        const channel = await getChannelById(channelId)
        const existUser = await getUserById(userId)

        //Verifica sino existe el canal o el usuario
        if (!existUser || !channel) {
            //Extrae el status, titulo y mensaje
            const { conflict } = statusHttp
            const { title, message } = userMessages.userOrChannelNotFound
            return res.status(conflict).json({ title, message })
        }

        //Valida y verifica si el usuario es el creador
        const isCreator = channel.creatorUserID == id
        if (!isCreator) {
            //Extrae el status, titulo y mensaje
            const { unauthorized } = statusHttp
            const { title, message } = userMessages.unauthorized
            return res.status(unauthorized).json({ title, message })
        }

        //Llama a la funcion para agregar al usuario
        await updateMember({ idChannel: channelId, member: userId })

        //Llama a la funcion para agregar al usuario como miembro
        await addUserAsChannelMember(userId, channelId)

        //Creo objeto con información del usuario y un mensaje
        const userInfo = { userId, userName: existUser.name }
        const messageCreate = {
            userInfo,
            messageContent: `${name} has added ${existUser.name}`
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
export default addUserToPrivateChannel