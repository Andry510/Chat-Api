//Dependecia de node(mongoose)
import { Types } from "mongoose";

//Modelos
import User from "../models/user.js";

//Obtiene el usuario en base al id
export const getUserById = async (id) => {
    try {

        //Convierto de  id en un objeto de mongoose y busca al usuario
        const userId = new Types.ObjectId(id);
        const user = await User.findById({ _id: userId }).select('-createdAt -updatedAt -refreshToken');

        return user

    } catch (error) {

        //Error
        throw error
    }
}

//Busca al usuario en base un email
export const getUserByEmail = async (email) => {
    try {

        //Busca el usuario en base un email
        const user = await User.findOne({ email }).select('-createdAt -updatedAt -refreshToken');

        return user

    } catch (error) {

        //Error
        throw error
    }
}

//Crea un usuario
export const createUser = async (body) => {
    try {

        //Crear el nuevo usuario 
        await User.create(body)

    } catch (error) {

        //Error
        throw error

    }
}


//Actualiza al usuario
export const updateUser = async (id, body) => {
    try {

        //Actualiza los datos del usuario
        await User.findByIdAndUpdate(id, { $set: body });

    } catch (error) {

        throw error
    }

}

//Agregar el canal creado 
export const addUserAsChannelCreator = async (id, channelId) => {
    try {

        //Actualizo al usuario como creador del canal
        await User.findByIdAndUpdate(id, { $push: { 'channels.createdBy': { channelId } } })

    } catch (error) {

        //Error
        throw error

    }
}

//Agregar al usuario como miembro del canal
export const addUserAsChannelMember = async (id, channelId) => {
    try {

        //Agrega el canal al usuario
        await User.findByIdAndUpdate(id, { $push: { 'channels.memberOf': { channelId } } })

    } catch (error) {

        //Error
        throw error
    }
}

//Elimina al usuario como creador del canala
export const deleteUserAsChannelCreator = async (id, channelId) => {
    try {

        //Elimina el canal del usuario
        await User.findByIdAndUpdate(id, { $pull: { 'channels.createdBy': { channelId } } })

    } catch (error) {

    }
}

//Eliminar usuario del canal
export const deleteUserAsChannelMember = async (id, channelId) => {
    try {

        //Elimina el canal del usuario
        await User.findByIdAndUpdate(id, { $pull: { 'channels.memberOf': { channelId } } })

    } catch (error) {

        //Error
        throw error
    }
}

//Eliminar usuario
export const deleteUser = async (id) => {
    try {

        //Elimina al usuario
        await User.findByIdAndDelete(id)

    } catch (error) {

        throw error
    }
}