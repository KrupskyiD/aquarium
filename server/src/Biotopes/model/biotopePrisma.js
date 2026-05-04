import prisma from "../../utils/prisma.js";

export const getAllBiotopes = async (data) => {
    return await prisma.biotopes.findFirst({
        where: {
            name: data.name
        }
    });
};