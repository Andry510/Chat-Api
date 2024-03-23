//Dependencia de node
import { validationResult } from "express-validator"

//Middleware de la lectura express-validator
const validateRequestBodyErrors = async (req, res, next) => {

    //Extrae los errores 
    const errors = validationResult(req)

    //Verifica si el error no esta vacio
    if (!errors.isEmpty()) {

        // Extraer solo los mensajes de error
        const errorMessages = await errors.array().map(error => `${error.msg}`);

        return res.status(401).json({ errors: errorMessages })
    }

    //Sigue con el siguiente middleware
    next()
}

export default validateRequestBodyErrors

