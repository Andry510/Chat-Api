//Servicios
import { updateUser } from "../../services/user.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"
const updateProfile = async (req, res) => {
    try {

        //Extrae el usuario y los datos de cuerpo (nombre, apellido, etc..)
        const { user, body: { name, lastName, email } } = req

        const userChanges = {}

        //Valida y verifica si existen cambios 
        if (name && name !== user.name) userChanges.name = name
        if (lastName && lastName !== user.lastName) userChanges.lastName = lastName
        if (email && email !== user.email) userChanges.email = email

        //Valida si se hicieron cambios en el usuario
        if (Object.keys(userChanges).length === 0) {
            //Extrae el status, titulo y mensaje 
            const { conflict } = statusHttp
            const { title, message } = userMessages.noChangesDetected
            return res.status(conflict).json({ title, message })
        }

        //Llama la funcion para actualizar
        await updateUser(user.id, userChanges)

        //Extrae el status, titulo y mensaje 
        const { OK } = statusHttp
        const { title, message } = userMessages.profileUpdated
        res.status(OK).json({ title, message, updates: userChanges })

    } catch (error) {
        //Extrae el status, titulo y mensaje del error
        const { status, title, message } = error

        return res.status(status || statusHttp.internalServerError).json({
            title: title || errorSystem.systemError.title,
            message
        })
    }
}

export default updateProfile