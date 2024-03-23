//Modelo
import { Types, } from "mongoose"
import Chat from "../models/chat.js"

//Funcion para crear chat
export const createChat = async (channelId) => {
    try {

        //Crea un chat
        await Chat.create({ channelId })

    } catch (error) {
        throw error
    }
}

//Funcion para eliminar chat
export const deleteChat = async (channelId) => {
    try {

        //Elimina el chat
        await Chat.deleteOne({ channelId })

    } catch (error) {

        //Error 
        throw error
    }
}

//Funcion para agregar mensaje
export const addMessage = async (channelId, body) => {
    try {

        //Agrega a la base de datos el mensaje
        const messageSaved = await Chat.findOneAndUpdate({ channelId },
            {
                $push: { messagesHistory: body }
            }, { new: true })

        return messageSaved.messagesHistory[messageSaved.messagesHistory.length - 1]

    } catch (error) {

        //Error
        throw error
    }
}

//Funcion para obtener el historial del chat
export const getChatHistory = async ({ idChannel, joinDateMember = null }) => {
    try {

        //Convierte el idChannel en un objeto de mongo
        const channelId = new Types.ObjectId(idChannel)

        //Crea una consulta con los parametros estandar 
        const query = [
            { $match: { channelId } },
            { $unwind: '$messagesHistory' },
            { $project: { _id: 0, messagesHistory: "$messagesHistory" } }
        ]

        //Verifica si se agrega la fecha
        if (joinDateMember) {
            //Agrega a la consulta, los parametros de fecha
            query.push({
                $match: { 'messagesHistory.sentAt': { $gte: new Date(joinDateMember) } }
            })
        }

        //Buscamos en la base de datos el historial de los mensajes
        const history = await Chat.aggregate(query)

        return history

    } catch (error) {

        //Error
        throw error
    }

}