//Dependecias de node(passport y passport-jwt)
import passport from "passport";
import { Strategy as jwtStrategy, ExtractJwt } from "passport-jwt";

//Variables de entorno
import { SECRET_TOKEN } from "../../config/config.js";

//Servicios
import { getUserById } from "../../services/user.js";

//Status y mensajes
import statusHttp from "../../messages/statusHttp.js";
import userMessages from "../../messages/userMessages.js";

//Opciones para controlar como extrae o verifica el token
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_TOKEN,
}

//Estrategia el token
passport.use("jwt-strategy", new jwtStrategy(opts, async (jwt_payload, done) => {
    try {
        
        //Extrae el id del token
        const { id } = jwt_payload

        //Llama a la funcion para buscar al usuario
        const user = await getUserById(id)

        //Verifica que el usuario no exista
        if (!user) {

            //Extrae el status, titulo y mensaje
            const { unauthorized } = statusHttp
            const { title, message } = userMessages.unauthorized

            //Creo un nuevo error y se modifica
            const error = new Error(message)
            error.title = title
            error.status = unauthorized
            return done(error);
        }

        return done(null, user)

    } catch (error) {

        //Error
        done(error);
    }
})
)

export default passport