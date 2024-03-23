//Dependecias de node(mongoose)
import { Types } from "mongoose"

//Modelos
import Channel from "../models/channel.js"


//Obtener canal por id
export const getChannelById = async (id) => {
    try {

        const idChannel = new Types.ObjectId(id)
        const channel = await Channel.findById(idChannel)

        return channel

    } catch (error) {

        //Error
        throw error

    }
}

//Funcion para obtener el canal
export const getOneChannel = async ({ userId, channelId, isPublic = false }) => {
    try {

        //Convierte el userId en un objeto de mongo
        const idUser = new Types.ObjectId(userId);

        //Consulta del canal
        const query = {
            _id: new Types.ObjectId(channelId),
            $or: [
                { creatorUserID: idUser },
                { 'members.member': idUser }
            ]
        };

        //Verifica si la opcion de publico esta activa
        if (isPublic) {
            query.$or.push({ type: 'public' });
        }
        
        // Busca el canal
        const channel = await Channel.findOne(query).select('-members -createdAt -updatedAt:');

        return channel;

    } catch (error) {
        // Manejo del error
        throw error;
    }
}


//Extrae los canales todo los canales publicos
export const getAllPublicChannels = async () => {
    try {

        //Obtiene todo los canales publicos
        const channels = await Channel.aggregate([
            { $match: { type: 'public' } },
            { $addFields: { countMembers: { $size: "$members" } } },
            { $project: { members: 0, createdAt: 0, updatedAt: 0 } }
        ])

        return channels

    } catch (error) {

        //Error
        throw error
    }
}

//Obtener la fecha de que el usuario entro
export const getCreatorAndMemberJoinDate = async (userId, channelId) => {
    try {

        //Transforma los valores en objetos de mongoo
        const idChannel = new Types.ObjectId(channelId);
        const idUser = new Types.ObjectId(userId);

        const joinDate = Channel.aggregate([
            { $match: { _id: idChannel } },
            { $unwind: { path: "$members", preserveNullAndEmptyArrays: true } },
            { $match: { $or: [{ "creatorUserID": idUser }, { "members.member": idUser },] } },
            { $project: { _id: 0, creatorUserID: 1, joinDateMember: "$members.joinedAt" } }
        ])

        return joinDate

    } catch (error) {

        //Error
        throw error
    }
}

//Crea un canal nuevo
export const createNewChannel = async (body) => {
    try {

        //Crea el canal
        const newChannel = await Channel.create(body)

        return newChannel.id

    } catch (error) {

        //Error
        throw error

    }
}

//Actualizar canal
export const updateChannelById = async (id, body) => {
    try {

        await Channel.findByIdAndUpdate(id, { $set: body })

    } catch (error) {

        //Error
        throw error
    }

}

//agrega o eliminar el miembro al canal
export const updateMember = async ({ idChannel, member, isDelete = false }) => {
    try {

        //Agrega al usuario como miembro  al canal 
        await Channel.findByIdAndUpdate(idChannel,
            !isDelete ?
                { $push: { members: { member } } }
                :
                { $pull: { members: { member } } }
        )

    } catch (error) {
        //Error
        throw error
    }
}

//Eliminar canal
export const deleteChannelById = async (id) => {
    try {

        //Elimina el canal
        await Channel.findByIdAndDelete(id)

    } catch (error) {

        //Error
        throw error
    }
}