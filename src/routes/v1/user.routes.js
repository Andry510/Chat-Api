//Dependecia de node (express)
import { Router } from "express";

//Validaciones 
import validateRequestBodyErrors from "../../middlewares/validations/validateRequestBodyErrors.js";
import validateRequestBodyFields from "../../middlewares/validations/validateRequestBodyFields.js";
import { validateSingUp, validateSingIn, validateEdit, validateEditPrivate } from "../../utils/validations/userValidations.js";

//Autentificación 
import passportAuth from "../../middlewares/authentication/passportAuth.js"

//Controladores 
import SingIn from "../../controllers/user/singIn.controller.js";
import SingUp from "../../controllers/user/singUp.controller.js";
import Profile from "../../controllers/user/profile.controller.js";
import updateProfile from "../../controllers/user/updateProfile.controller.js";
import updateProfilePrivate from "../../controllers/user/updateProfilePrivate.controller.js";
import deleteProfile from "../../controllers/user/deleteProfile.controller.js";
import refreshToken from "../../controllers/user/refreshToken.controller.js";


//------- Rutas -------
const routers = Router()

//Registro
routers.post('/singUp',

    //Funcion que revise que no haya nada mas en el cuerpo
    validateRequestBodyFields(['name', 'lastName', 'email', 'password', 'phoneNumber']),

    //Funcion que revisa los elementos del cuerpo
    [validateSingUp(), validateRequestBodyErrors],

    //Funcion para registrar al usuario
    SingUp
)

//Inicio de sesion
routers.post('/singIn',

    //Funcion que revise que no haya nada mas en el cuerpo
    validateRequestBodyFields(['email', 'password']),

    //Funcion que revisa los elementos del cuerpo
    [validateSingIn(), validateRequestBodyErrors],

    //Logica local de inicio de sesión
    passportAuth('sing-in'),

    //Funcion para el inicio de sesión
    SingIn
)

//Obtener el perfil del usuario
routers.get('/profiles',

    //Logica del token para verificación
    passportAuth("jwt-strategy"),

    //Funcion para obtener el perfil del usuario
    Profile
)

//Editar el perfil de usuario
routers.put('/profiles/edit',

    //Funcion que revise que no haya nada mas en el cuerpo
    validateRequestBodyFields(['name', 'lastName', 'email', 'phoneNumber']),

    //Funcion que revisa los elementos del cuerpo
    [validateEdit(), validateRequestBodyErrors],

    //Logia del token
    passportAuth('jwt-strategy'),

    //Funcion para editar el perfil de un usuario
    updateProfile
)

//Editar el perfil del usuario(privadas como numero y contraseña)
routers.put('/profiles/edit/private',

    //Funcion que revise que no haya nada mas en el cuerpo
    validateRequestBodyFields(['newPassword']),

    //Funcion que revisa los elementos del cuerpo
    [validateEditPrivate(), validateRequestBodyErrors],

    //Logica del token
    passportAuth('jwt-strategy'),

    //Funcion para editar la contraseña a un usuario
    updateProfilePrivate
)


//Eliminar usuario
routers.delete('/profiles',

    //Logica del token
    passportAuth('jwt-strategy'),

    //Funcion para eliminar un usuario
    deleteProfile
)

//Actualizar nuevo token
routers.put('/refreshToken',

    //Funcion para actualizar el token
    refreshToken
)


export default routers