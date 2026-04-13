import prisma from "../../utils/prisma.js";


export const getAllAquariums = async (userId) => {
    return await prisma.aquarium.findMany({
        where: { user_id: userId }
    });
}


export const getAquariumById = async (id, userId) => {
    return await prisma.aquarium.findFirst({
        where: {
            id: parseInt(id),
            user_id: userId
        },
        })
}


export const createAquarium = async (data, userId) => {
    return await prisma.aquarium.create({
        data: {
            name: data.name,
            min_salt: data.min_salt,
            max_salt: data.max_salt,
            min_temp: data.min_temp,
            max_temp: data.max_temp,
            device_serial: data.device_serial,
            user_id: userId,
        }
    })
}


export const updateAquarium = async (id, data, userId) => {
    return await prisma.aquarium.update({
        where: {
            id: parseInt(id)
        },
        data: data,
    })
}

export const deleteAquarium = async (id,userId) => {
    return await prisma.aquarium.delete({
        where: {
            id: parseInt(id),
            user_id: userId
        },
    })
}
