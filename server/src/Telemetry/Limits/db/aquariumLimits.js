import prisma from "../../../utils/prisma.js";

export const getLimits = async (device_number) => {
    const limits = await prisma.aquarium.findFirst({
        where: {
            device_number,
        },
        select: {
            min_salt: true,
            max_salt: true,
            min_temp: true,
            max_temp: true,
        },

    });

    return limits;
};