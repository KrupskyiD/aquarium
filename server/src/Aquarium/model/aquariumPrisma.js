import prisma from "../../utils/prisma.js";

// тут я отримую всі акваріумів, які є у клієнта
export const getAllAquariums = async (userId) => {
    return await prisma.aquarium.findMany({
        where: { user_id: userId }
    });
}

// отримую конкретний акваріум, з провіркою власника
export const getAquariumById = async (id, userId) => {
    return await prisma.aquarium.findFirst({
        where: {
            id: parseInt(id),
            user_id: userId
        },
    })
}

// стоврюю новий акваріум
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
            liters: parseInt(data.volume),
            aquarium_type: data.type
        }
    })
}

//оновляю акваріум (додав user_id для безпеки, мб це лишнє)
export const updateAquarium = async (id, data) => {
    const updateData = {};

    if (data.name != null) updateData.name = data.name;
    if (data.volume != null) updateData.liters = parseInt(data.volume, 10);
    if (data.type != null) updateData.aquarium_type = data.type;
    if (data.min_salt != null) updateData.min_salt = data.min_salt;
    if (data.max_salt != null) updateData.max_salt = data.max_salt;
    if (data.min_temp != null) updateData.min_temp = data.min_temp;
    if (data.max_temp != null) updateData.max_temp = data.max_temp;
    if (data.device_serial != null) updateData.device_serial = data.device_serial;

    return await prisma.aquarium.update({
        where: {
            id: parseInt(id, 10),
        },
        data: updateData,
    });
};

export const deleteAquarium = async (id, userId) => {
    return await prisma.aquarium.delete({
        where: {
            id: parseInt(id),
            user_id: userId
        },
    })
}
