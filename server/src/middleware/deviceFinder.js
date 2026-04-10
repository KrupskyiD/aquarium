import prisma from '../utils/prisma.js'; 
 
 export const findDeviceInDB = async(device) => {
        return prisma.aquarium.findUnique({
            where: {device_serial: device}
        });
    }