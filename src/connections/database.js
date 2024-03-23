import { connect } from "mongoose";
import { MONGODB_URL } from "../config/config.js";

//Conexion a la base de datos
const connectionDB = async () => {
    try {

        const database = await connect(MONGODB_URL);
        console.log("Connected to", database.connection.name);

    } catch (error) {

        //Errores
        throw error
    }
}

export default connectionDB