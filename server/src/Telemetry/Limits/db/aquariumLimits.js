import prisma from "../../../utils/prisma.js";

export const getLimits = async (device_serial) => {
    const limits = await prisma.aquarium.findFirst({
        where: {
            device_number: device_serial,
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