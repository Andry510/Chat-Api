//Servicios de base de datos
import { getCreatorAndMemberJoinDate } from "../services/channel.js";
import { getChatHistory } from "../services/chat.js";

//Logger
import { socketLogger } from "../utils/logs/loggers.js";

//Mensajes 
import messages from "../messages/chatMessage.js";
import { addMessage } from "../services/chat.js";

//Error
import socketErrorHandler from "../middlewares/errors/socketErrorHandler.js";

const initializeSocket = (io) => {
    try {
        
        //Uso de los logger 
        io.use(socketLogger)

        //Uso del error
        io.use(socketErrorHandler)

        io.on('connection', (socket) => {

            const { user, rooms } = socket

            //Entrar al grupo del canal
            socket.on('join-channel', async ({ channelId }) => {
                try {

                    //Convierte las habitaciones en un array
                    const roomsUser = Array.from(rooms)

                    //valida si esta unido en otro grupo (habitacion)
                    const differentRoomId = (roomsUser.length > 1) ? (channelId !== roomsUser[1]) : false

                    //Verifica que si esta en otro grupo (habitacion)
                    if (differentRoomId) {
                        //Elimina la habitación anterior 
                        socket.leave(roomsUser[1])
                    }

                    //Obtenemos el creador y fecha de ingreso(miembro)
                    const creatorAndMemberJoinDate = await getCreatorAndMemberJoinDate(user.id, channelId)

                    //Verifica que exista el canal
                    if (creatorAndMemberJoinDate.length === 0) {

                        //Extra los datos del la respuesta 
                        const { title, message } = messages.joinGroupNotPermission

                        //Entra a la sala del canal
                        return socket.emit('server-response', { title, message })
                    }

                    //Extrae el creador del canal y la fecha de ingreso(miembro)
                    const { creatorUserID, joinDateMember } = creatorAndMemberJoinDate[0]

                    //Valida si el usuario es el creador
                    const isCreator = creatorUserID == user.id

                    //Llama a la funcion para obtener todo el historial del chat (id de canal y fecha que se unio el miembro)
                    const chatHistory = await getChatHistory({ idChannel: channelId, joinDateMember: isCreator ? null : joinDateMember })

                    //Extrae el titulo y el mensaje del objeto
                    const { title, message } = messages.joinGroup

                    //Entra al grupo (habitacion)
                    socket.join(channelId)

                    //Devuelve el historial del chat y avisa con un titulo y un mensaje
                    socket.emit('server-response', { title, message, channelHistory: chatHistory })

                } catch (error) {

                    //Mensaje de error
                    const { message } = error
                    socket.emit('server-error', message)
                }
            })

            //Mensaje 
            socket.on('channel-message', async ({ message }) => {
                try {

                    const roomsUser = Array.from(rooms)

                    //Valida si estas en una grupo (habitacion)
                    const isJoinRoom = roomsUser.length > 1

                    //Verifica que no estas en un grupo
                    if (isJoinRoom) {

                        //Extrae el titulo y el nombre
                        const { title, message } = messages.notJoinedAnyGroup

                        socket.emit('server-error', { title, message })
                    }

                    //Captura la información del usuario (id y nombre)
                    const userDetails = { userId: user.id, userName: user.name }

                    //Agrupa toda la información antes de enviarlo a la base de datos y al grupo
                    const userDataToBroadcast = {
                        user: userDetails,
                        messageContent: message
                    }

                    //Llama a la funcion guardar el mensaje
                    const messageSaved = await addMessage(roomsUser[1], userDataToBroadcast)

                    socket.to(roomsUser[1]).emit('channel-message', { message: messageSaved })

                    socket.emit('server-response', { message: messageSaved })

                } catch (error) {

                    //Mensaje de error
                    const { message } = error
                    socket.emit('server-error', message)
                }
            })

            //Salir de canal 
            socket.on('exit-channel', async () => {
                try {

                    //Convierte las habitaciones en un array
                    const roomsUser = Array.from(rooms)

                    //valida si esta unido en otro grupo (habitacion)
                    const differentRoomId = (roomsUser.length > 1) ? (channelId !== roomsUser[1]) : false

                    //Verifica que si esta en otro grupo (habitacion)
                    if (!differentRoomId) {
                        //Extrae el titulo y el nombre
                        const { title, message } = messages.notJoinedAnyGroup

                        socket.emit('server-error', { title, message })
                    }

                    //Elimina la habitación anterior 
                    socket.leave(roomsUser[1])

                    const { title, message } = messages.leftGroupMessage

                    socket.emit('server-response', { title, message })
                } catch (error) {

                    //Mensaje de error
                    const { message } = error
                    socket.emit('server-error', message)

                }
            })

            //Desconectar
            socket.on('disconnect', () => {
                console.log('disconnect')
            })

        })

    } catch (error) {

        //Error
        throw error
    }
}

export default initializeSocket