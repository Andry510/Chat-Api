//Servicios
import { createNewChannel } from "../../services/channel.js"
import { createChat, addMessage } from "../../services/chat.js"
import { addUserAsChannelCreator } from "../../services/user.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const createChannel = async (req, res) => {
    try {
        //Extrae el id del usuario y los datos del cuerpo
        const { user: { id, name: userName }, body: { name, type, category } } = req

        //Creamos un variable para almacenar y estructurar el cuerpo
        const channelBody = { creatorUserID: id, name, type, category }

        //Llamamos a la funcion para crear el canal y obtener el id
        const channelId = await createNewChannel(channelBody)

        //Llamamos a la funcion agregar al canal como su creador
        await addUserAsChannelCreator(id, channelId)

        //Llama a la funcion para crear un chat
        await createChat(channelId)

        //Creo objeto con información del usuario y un mensaje
        const userInfo = { userId: id, userName }
        const messageCreate = {
            userInfo,
            messageContent: `${userName} has created the channel`
        }

        //LLama a la funcion para mandar un mensaje a la sala
        await addMessage(channelId, messageCreate)

        //Extrae el status, titulo y mensaje
        const { created } = statusHttp
        const { title, message } = userMessages.channelCreated
        res.status(created).json({ title, message, id: channelId })

    } catch (error) {
        //Extrae el status, titulo y mensaje del error
        const { status, title, message } = error

        return res.status(status || statusHttp.internalServerError).json({
            title: title || errorSystem.systemError.title,
            message
        })
    }
}

export default createChannel