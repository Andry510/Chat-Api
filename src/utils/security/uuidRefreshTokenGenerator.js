//Dependecias de node (uuid)
import { v4 as uuidv4 } from 'uuid'

//Funcion para generar uuid para el refreshToken
const uuidRefreshTokenGenerator = () => {

    //Genera un uuid y lo pone en un json
    const uuidRefreshToken = { refreshToken: uuidv4() }

    return uuidRefreshToken
}

export default uuidRefreshTokenGenerator