//Dependecias de node(bcrypt)
import { compare } from "bcrypt"

//Servicios
import { updateUser } from "../../services/user.js"

//Seguridad
import passwordEncryption from "../../utils/security/encryption.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const updateProfilePrivate = async (req, res) => {
    try {
        //Extrae el usuario y los datos de cuerpo (nombre, apellido, etc..)
        const { user, body: { newPassword, phoneNumber } } = req

        const userChanges = {}

        //Verifica si la contraseña es la misma
        const passwordsMatch = await compare(newPassword, user.password)

        //Valida y verifica si existen cambios 
        if (newPassword && !passwordsMatch) userChanges.password = await passwordEncryption(newPassword)
        if (phoneNumber && phoneNumber !== user.phoneNumber) userChanges.phoneNumber = phoneNumber

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

export default updateProfilePrivate