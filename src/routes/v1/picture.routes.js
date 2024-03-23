//Dependecias de node (express)
import { Router } from "express";

//Autentificación
import passportAuth from "../../middlewares/authentication/passportAuth.js";

//Controladores
import updateProfilePicture from "../../controllers/picture/updateProfilePicture.controller.js";
import updateBackgroundPicture from "../../controllers/picture/updateBackgroundPicture.controller.js";
import updateChannelPicture from "../../controllers/picture/updateChannelPicture.controller.js";

const routes = Router()

routes.put('/profilePictures',

    //Logica del token
    passportAuth('jwt-strategy'),

    //Fucion de editar la foto de perfil
    updateProfilePicture
)

routes.put('/backgroundPictures',
    //Logica del token
    passportAuth('jwt-strategy'),

    //Funcion de editar la foto del fondo
    updateBackgroundPicture
)

routes.put('/channels/:channelId',

    //Logica del token
    passportAuth('jwt-strategy'),

    //Funcion para editar la foto del canal
    updateChannelPicture
)

export default routes


