//Dependecias de node (jsonwebtoken)
import jwt from "jsonwebtoken";

//Variable de entorno
import { SECRET_TOKEN } from "../../config/config.js";

//Funcion para generar tokens de acceso
const generateTokens = (id, expireToken) => {
    try {
        
        //Crea un token
        return jwt.sign({ id }, SECRET_TOKEN, {
            expiresIn: expireToken
        });

    } catch (error) {

        throw error
    }
}


export default generateTokens