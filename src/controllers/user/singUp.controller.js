//Servicios
import { getUserByEmail } from "../../services/user.js"
import { createUser } from "../../services/user.js"

//Seguridad
import passwordEncryption from "../../utils/security/encryption.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const SingUp = async (req, res) => {
    try {

        //Extrae nombre, apellido, numero, email y password
        const { name, lastName, phoneNumber, email, password } = req.body

        const isExistingEmail = await getUserByEmail(email)

        //Verifica si el email existe
        if (isExistingEmail) {
            //Extrae el status, titulo y mensaje
            const { conflict } = statusHttp
            const { title, message } = userMessages.emailInUse
            return res.status(conflict).json({ title, message })
        }

        //Llamo a la funcion para que me encripte mi contraseña
        const encryptedPassword = await passwordEncryption(password)

        //Creo un json en el cual almacena todo los campos
        const body = { name, lastName, phoneNumber, email, password: encryptedPassword }

        //Creo un nueo usuario
        await createUser(body)

        //Extrae el status, titulo y mensaje
        const { created } = statusHttp
        const { title, message } = userMessages.registrationSuccess
        return res.status(created).json({ title, message })

    } catch (error) {
        
        //Extrae el status, titulo y mensaje del error
        const { status, title, message } = error

        return res.status(status || statusHttp.internalServerError).json({
            title: title || errorSystem.systemError.title,
            message
        })
    }
}

export default SingUp