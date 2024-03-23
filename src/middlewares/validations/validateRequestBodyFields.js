//Middleware de errores del cuerpo
const validateRequestBodyFields = (fields) => (req, res, next) => {

    //Obtengo las claves
    const objectKeys = Object.keys(req.body);

    //Verifico si hay campos no especificados dentro del body
    const extraParams = objectKeys.filter(key => !fields.includes(key));    
    if (extraParams.length > 0) {
        const message = `Incorrect parameters provided: ${extraParams.join(', ')}`

        return res.status(401).json({ message })
    }

    next()
}

export default validateRequestBodyFields