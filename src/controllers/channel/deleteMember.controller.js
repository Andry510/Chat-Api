//Servicios 
import { getChannelById, updateMember } from "../../services/channel.js"
import { deleteUserAsChannelMember } from "../../services/user.js"
import { addMessage } from "../../services/chat.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const deleteMember = async (req, res) => {
    try {
        //Extrae el id del usuario y el id del canal
        const { user: { id, name }, body: { channelId } } = req

        //Llama a la funcion para obtener el canal 
        const channel = await getChannelById(channelId)

        //Verifica si existe el canal
        if (!channel) {
            //Extrae el status, titulo y mensaje
            const { notFound } = statusHttp
            const { title, message } = userMessages.channelNotFound
            return res.status(notFound).json({ title, message })
        }

        //Valida y verifica si el usuario es miembro
        const isCreator = channel.creatorUserID == id
        const isMember = channel.members.some(members => members.member == id)
        if (!isMember || isCreator) {
            //Extrae el status, titulo y mensaje
            const { conflict } = statusHttp
            const { title, message } = userMessages.memberNotExist
            return res.status(conflict).json({ title, message })
        }

        //Llama a la funcion para eliminar usuario
        await updateMember({ idChannel: channelId, member: id, isDelete: true })

        //Llama a la funcion para eliminar el canal del usuario
        await deleteUserAsChannelMember(id, channelId)

        //Creo objeto con información del usuario y un mensaje
        const userInfo = { userId: id, userName: name }
        const messageCreate = {
            userInfo,
            messageContent: `${name} has left the channel`
        }

        //LLama a la funcion para mandar un mensaje a la sala
        await addMessage(channelId, messageCreate)

        //Extrae el status, titulo y mensaje
        const { noContent } = statusHttp
        const { title, message } = userMessages.deleteMember
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

export default deleteMember