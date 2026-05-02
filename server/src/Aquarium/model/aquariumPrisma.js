import prisma from "../../utils/prisma.js";

// тут я отримую всі акваріумів, які є у клієнта
export const getAllAquariums = async (userId) => {
    return await prisma.aquarium.findMany({
        where: { user_id: userId },
        include: {
            metrics: {
                orderBy: { created_at: "desc" },
                take: 1,
            },
        },
        orderBy: { id: "desc" },
    });
};

// отримую конкретний акваріум, з провіркою власника
export const getAquariumById = async (id, userId) => {
    return await prisma.aquarium.findFirst({
        where: {
            id: parseInt(id),
            user_id: userId,
        },
        include: {
            metrics: {
                orderBy: { created_at: "desc" },
                take: 1,
            },
        },
    });
};

// стоврюю новий акваріум
export const createAquarium = async (data, userId) => {
    return await prisma.aquarium.create({
        data: {
            name: data.name,
            volume: data.volume,
            type: data.type,
            device_number: data.device_number,
            min_salt: data.min_salt,
            max_salt: data.max_salt,
            min_temp: data.min_temp,
            max_temp: data.max_temp,
            user_id: userId,
        },
    });
};

//оновляю акваріум (додав user_id для безпеки, мб це лишнє)
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
