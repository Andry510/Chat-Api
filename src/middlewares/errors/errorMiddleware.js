//Status y mensaje
import statusHttp from "../../messages/statusHttp.js";
import errorSystem from "../../messages/errorSystem.js";

// Middleware global para manejar errores
const errorHandler = (err, req, res, next) => {

    //Extrae el status, titulo y mensaje
    const {internalServerError}  = statusHttp
    const { title, message } = errorSystem.systemError
    
    // Envía una respuesta de error al cliente
    res.status(err.status ||  internalServerError).json({
        title: err.title || title,
        message:err.message || message
    });
};

export default errorHandler;
