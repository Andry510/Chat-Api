//Dependecias de node (bycrypt)
import { genSalt, hash } from "bcrypt"

//Variable de entorno 
import { SALT_ROUNDS } from "../../config/config.js"


//Funcion para encriptar la  contraseña
const passwordEncryption = async (password) => {
    try {

        //Numero de saltos
        const saltRounds = parseInt(SALT_ROUNDS) || 10

        //Genera un salto unico para la contraseña
        const salt = await genSalt(saltRounds)

        //Encripta la contraseña junto con los saltos generados
        const passwordHash = await hash(password, salt)

        return passwordHash

    } catch (error) {
           
        //Error
        throw error
    }
}

export default passwordEncryption