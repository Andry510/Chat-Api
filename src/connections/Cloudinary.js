//Dependecias de node(Clodinary)
import { v2 as cloudinary } from "cloudinary";
//Variables de entorno
import { CLOUDINARY_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET } from "../config/config.js"

const Cloudinary = async (file, folder, name) => {
    try {
        // Configurar Cloudinary
        cloudinary.config({
            cloud_name: CLOUDINARY_NAME,
            api_key: CLOUDINARY_KEY,
            api_secret: CLOUDINARY_SECRET
        });
        // Subir la imagen a Cloudinary
        const result = await cloudinary.uploader.upload(file, {
            folder,
            public_id: name
        });

        // Obtener la URL de la imagen subida
        const imageUrl = result.secure_url;

        // Devolver la URL de la imagen subida
        return imageUrl;

    } catch (error) {
        //Error
        throw error
    }
}

export default Cloudinary