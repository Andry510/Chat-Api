
//Status y mensajes
import statusHttp from "../../messages/statusHttp.js"
import userMessages from "../../messages/userMessages.js"
import errorSystem from "../../messages/errorSystem.js"

const Profile = async (req, res) => {
    try {

        //Extae el usario 
        const { user } = req

        //Extrae el status, titulo y mensaje
        const { OK } = statusHttp
        const { title, message } = userMessages.profileRetrieved
        return res.status(OK).json({ title, message, profile: user })

    } catch (error) {

        //Extrae el status, titulo y mensaje del error
        const { status, title, message } = error

        return res.status(status || statusHttp.internalServerError).json({
            title: title || errorSystem.systemError.title,
            message
        })
    }
}

export default Profile