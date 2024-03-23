//Cloudinary
import Cloudinary from "../../connections/cloudinary.js"

//Servicios
import { updateUser } from "../../services/user.js"

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const updateBackgroundPicture = async (req, res) => {
    try {

        //Extrae el usuario
        const { user, file } = req

        //Verifica sino existe el archivo
        if (!file) {
            //Extrae el status, titulo y mensaje
            const { conflict } = statusHttp
            const { title, message } = userMessages.fileNotExist
            return res.status(conflict).json({ title, message })
        }

        //Llama a la funcion para obtener la url
        const url = await Cloudinary(file.path, 'users/backgroundPicture', user.name)

        //Crea un objeto para almacenar los nuevo datos
        const dataPicture = {
            profileImage: {
                profilePictureUrl: user.profileImage.profilePictureUrl,
                backgroundPictureUrl: url
            }
        }

        //Llama a la funcion para actualizar el usuario
        await updateUser(user.id, dataPicture)

        //Extrae el status, titulo y mensaje
        const { OK } = statusHttp
        const { title, message } = userMessages.profileUpdated
        res.status(OK).json({ title, message, url })
    } catch (error) {
        //Extrae el status, titulo y mensaje del error
        const { status, title, message } = error

        return res.status(status || statusHttp.internalServerError).json({
            title: title || errorSystem.systemError.title,
            message
        })
    }
}
export default updateBackgroundPicture