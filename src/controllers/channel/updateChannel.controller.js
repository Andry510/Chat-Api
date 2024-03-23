//Servicios
import { getChannelById, updateChannelById } from "../../services/channel.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const updateChannel = async (req, res) => {
    try {
        
        //Extrae el id del usuario, el parametro y el nombre, tipo o categoria del cuerpo
        const { user: { id }, params: { channelId }, body: { name, type, category } } = req

        //Llama a la funcion para obtener el canal
        const channel = await getChannelById(channelId)

        //Verifica si el canal existe
        if (!channel) {
            //Extrae el status, titulo y mensaje
            const { conflict } = statusHttp
            const { title, message } = userMessages.channelNotFound
            return res.status(conflict).json({ title, message })
        }

        //Valida si el usuario es el creador
        const isCreator = id == channel.creatorUserID

        //Verifica si el usuario no es el creador
        if (!isCreator) {
            //Extrae el status, titulo y mensaje
            const { unauthorized } = statusHttp
            const { title, message } = userMessages.unauthorized
            return res.status(unauthorized).json({ title, message })
        }

        //Creamos una variable para almacenar los cambios 
        const channelChanges = {}

        //Valida y verifica si existen cambios 
        if (name && name !== channel.name) channelChanges.name = name
        if (type && type !== channel.type) channelChanges.type = type
        if (category && category !== channel.category) channelChanges.category = category

        //Valida sino se hicieron cambios en el canal
        if (Object.keys(channelChanges).length === 0) {
            //Extrae el status, titulo y mensaje 
            const { conflict } = statusHttp
            const { title, message } = userMessages.noChangesDetected
            return res.status(conflict).json({ title, message })
        }

        //Llama a la funcion para actualizar los datos
        await updateChannelById(channelId, channelChanges)

        //Extrae el status, titulo y mensaje
        const { OK } = statusHttp
        const { title, message } = userMessages.profileUpdated
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

export default updateChannel