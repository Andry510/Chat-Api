//Dependecias de node(passport, passport-local y bcryptjs)
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { compare } from "bcrypt"

//Servicios
import { getUserByEmail } from "../../services/user.js";

//Status y mensaje
import statusHttp from "../../messages/statusHttp.js";
import userMessages from "../../messages/userMessages.js";

//Estrategia local para el inicio de sesión
passport.use('sing-in', new localStrategy(
    
    //Extrae el email y el passport del cuerpo
    { usernameField: "email", passwordField: "password" },

    //Funcion de validacion de usuario
    async (email, password, done) => {
        try {
        
            //Llama a la funcion para buscar al usuario
            const user = await getUserByEmail(email);
            
            //Verifica si el usuario existe
            if (!user) {

                //Extrae el status, titulo y mensaje
                const { unauthorized } = statusHttp
                const { title, message } = userMessages.incorrectCredentials

                //Creo un nuevo error y se modifica
                const error = new Error(message)
                error.title = title
                error.status = unauthorized
                return done(error, false,);
            }

            //Valida si la contraseña es la misma
            const passwordsMatch = await compare(password, user.password)

            //Verifica si la contraseña no es la misma
            if (!passwordsMatch) {

                //Extrae el status, titulo y mensaje
                const { unauthorized } = statusHttp
                const { title, message } = userMessages.incorrectCredentials

                //Creo un nuevo error y se modifica
                const error = new Error(message)
                error.title = title
                error.status = unauthorized
                return done(error, false,);
            }

            done(null, user)

        } catch (error) {

            //Error
            done(error, false)
        }
    }
)
)

export default passport