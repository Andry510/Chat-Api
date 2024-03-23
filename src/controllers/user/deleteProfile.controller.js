//Servicios
import { deleteUser } from "../../services/user.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const deleteProfile = async (req, res) => {
    try {
        const { id } = req.user

        await deleteUser(id)

        //Extrae el status, titulo y mensaje
        const { noContent } = statusHttp
        const { title, message } = userMessages.profileDeleted
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

export default deleteProfile