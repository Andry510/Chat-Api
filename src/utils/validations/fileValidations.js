//Dependecias de node (multer)
import multer from "multer";

// Status y Mensajes 
import statusHttp from "../../messages/statusHttp.js";
import errorSystem from "../../messages/errorSystem.js";

// Configura Multer para guardar el archivo en disco
const storage = multer.diskStorage({});

const fileUploadMiddleware = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {

        // Extensiones de archivo permitidas
        const allowedExtensions = ['png', 'jpg', 'jpeg']
        const fileExtension = file.originalname.split('.').pop().toLowerCase();

        //Verifica si el archivo no cumple con las extensiones especificadas
        if (!allowedExtensions.includes(fileExtension)) {
            //Extrae el status, titulo y mensaje de los objetos
            const { conflict } = statusHttp
            const { title, message } = errorSystem.errorExtension

            //Crea un nuevo error
            const error = new Error(message);
            error.status = conflict;
            error.title = title
            cb(error, false);

            return;
        }

        // Tipos MIME permitidos
        const allowedMimeTypes = ['image/jpeg', 'image/png'];

        //Verifica si el archivo no cummple con los MIME espeficicados 
        if (!allowedMimeTypes.includes(file.mimetype)) {

            //Extrae el status, titulo y mensaje de los objetos
            const { conflict } = statusHttp
            const { title, message } = errorSystem.errorExtension

            //Crea un nuevo error
            const error = new Error(message);
            error.status = conflict;
            error.title = title;
            cb(error, false);

            return;
        }

        //Tamaño permitido
        const maxSize = 5 * (1024 ** 2);

        //Verifica si el tamaño del archivo es mayo
        if (file.size > maxSize) {

            //Extrae el status, titulo y mensaje de los objetos
            const { conflict } = statusHttp
            const { title, message } = errorSystem.errorSize

            //Crea un nuevo error
            const error = new Error(message);
            error.status = conflict;
            error.title = title;
            cb(error, false);

            return;
        }

        cb(null, true);

    }
});

export default fileUploadMiddleware