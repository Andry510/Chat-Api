//Dependecias de node (passport)
import passport from "passport"

//Status y mensaje
import statusHttp from "../../messages/statusHttp.js";
import messagesSystem from "../../messages/system.js";

//Middleware que llama a una estrategia y monitorea el control de errores
const passportAuth = (strategyName) => (req, res, next) => {
    passport.authenticate(strategyName, { session: false }, (err, user, info) => {
        //Verifica si hay un error
        if (err) return next(err);

        if (info) {
            //Extrae el status y el titulo
            const { unauthorized } = statusHttp
            const { title } = messagesSystem.unauthorized

            //Crea un nuevo error
            const error = new Error(info)
            error.status = unauthorized
            error.title = title
            
            next(error)
        }

        req.user = user;

        next();

    })(req, res, next);
}

export default passportAuth