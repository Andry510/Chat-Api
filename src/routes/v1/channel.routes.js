//Dependencias de node (express)
import { Router } from "express";

//Validaciones
import validateRequestBodyErrors from "../../middlewares/validations/validateRequestBodyErrors.js";
import validateRequestFields from "../../middlewares/validations/validateRequestBodyFields.js";
import { newChannel, bodyAddMember, bodyUpdate, paramId } from "../../utils/validations/channelValidation.js";

//Autentificación
import passportAuth from "../../middlewares/authentication/passportAuth.js";

//Controladores
import getChannel from "../../controllers/channel/getChannel.controller.js";
import getPublicChannels from "../../controllers/channel/getPublicChannels.controller.js";
import createChannel from "../../controllers/channel/createChannel.controller.js";
import updateChannel from "../../controllers/channel/updateChannel.controller.js";
import addUserToPublicChannel from "../../controllers/channel/addUserToPublicChannel.controller.js";
import addUserToPrivateChannel from "../../controllers/channel/addUserToPrivateChannel.controller.js";
import deleteMember from "../../controllers/channel/deleteMember.controller.js";
import deleteChannel from "../../controllers/channel/deleteChannel.controller.js";

const router = Router()

//------- Rutas -------

//Obtener un canal
router.get('/:channelId',

    //Valida el parametro del request
    [paramId(), validateRequestBodyErrors],

    //Logica del token
    passportAuth('jwt-strategy'),

    //Funcion para obtener un canal publico o privato
    getChannel
)

//Obtener canales publicos
router.get('/',

    //Logica del token
    passportAuth('jwt-strategy'),

    //Funcion para obtener los canales publicos
    getPublicChannels
)

//Crear un canal nuevo
router.post('/',

    //Funcion que revise que no haya nada mas en el cuerpo
    validateRequestFields(['name', 'type', 'category']),

    //Funcion que revisa los parametros del cuerpo
    [newChannel(), validateRequestBodyErrors],

    //Logica del token
    passportAuth('jwt-strategy'),

    //Funcion para crear un canal
    createChannel
)

//Editar un canal
router.put('/edit/:channelId',

    //Funcion que revise que no haya nada mas en el cuerpo
    validateRequestFields(['name', 'type', 'category']),

    //Valida el parametro y del cuerpo
    [paramId(), bodyUpdate(), validateRequestBodyErrors],

    //Logica del token
    passportAuth('jwt-strategy'),

    //Funcion para actualizar el canal
    updateChannel
)

//Agregar miembro(publico)
router.put('/public/members',

    //Funcion que revise que no haya nada mas en el cuerpo
    validateRequestFields(['channelId']),

    //Funcion que revisa los elementos del cuerpo
    [bodyAddMember(), validateRequestBodyErrors],

    //Logica del token
    passportAuth('jwt-strategy'),

    //Funcion para agregar a un usuario como miembro
    addUserToPublicChannel
)

//Agregar miembro(publico)
router.put('/private/members',

    //Funcion que revise que no haya nada mas en el cuerpo
    validateRequestFields(['channelId', 'userId']),

    //Funcion que revisa los elementos del cuerpo
    [bodyAddMember(), validateRequestBodyErrors],

    //Logica del token
    passportAuth('jwt-strategy'),

    //Funcion para agregar a un usuario como miembro
    addUserToPrivateChannel
)

//Eliminar miembro (solo)
router.delete('/members',

    //Funcion que revise que no haya nada mas en el cuerpo
    validateRequestFields(['channelId']),

    //Funcion que revisa los elementos del cuerpo
    [bodyAddMember(), validateRequestBodyErrors],

    //Logica del token
    passportAuth('jwt-strategy'),

    //Funcion para eliminar a un usuario como miembro
    deleteMember
)

//Eliminar canal
router.delete('/:channelId',

    //Valida el parametro
    [paramId(), validateRequestBodyErrors],

    //Logica del token
    passportAuth('jwt-strategy'),

    //Funcion para eliminar un canal
    deleteChannel
)

export default router