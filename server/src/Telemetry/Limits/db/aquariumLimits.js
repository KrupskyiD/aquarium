import prisma from "../../../utils/prisma";

export const getLimits = async (data) => {
    const limits = await prisma.aquarium.findFirst({
        data: {
            aquarium: {
                connect: {
                    device_serial: data.device_serial
                },
            },
            select: {
                min_salt: true,
                max_salt: true,
                min_temp: true,
                max_temp: true,
            },
        }
    });

    //if(!limits) return null;
    return limits;
};