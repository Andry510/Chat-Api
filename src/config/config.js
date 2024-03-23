//Dependencias de node
import { config } from "dotenv"

config();

//Puerto
const PORT = process.env.PORT || 3000;

//Url clave para el acceso a la base de datos mongodb
const MONGODB_URL = process.env.MONGODB_URL

//Clave de secreta y limite de duracion del token
const SECRET_TOKEN = process.env.SECRET_TOKEN
const EXPIRES_TOKEN = process.env.EXPIRES_TOKEN
const EXPIRES_REFRESH_TOKEN = process.env.EXPIRES_REFRESH_TOKEN

//Claves del cloudinary
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET

//Bcrypt
const SALT_ROUNDS = process.env.SALT_ROUNDS


export {
    //Puerto
    PORT,

    //Base de datos
    MONGODB_URL,

    //Tokens
    SECRET_TOKEN, EXPIRES_TOKEN, EXPIRES_REFRESH_TOKEN,

    //Cloudinary
    CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET,

    //Bcrypt
    SALT_ROUNDS
}