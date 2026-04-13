import prisma from "../../utils/prisma.js";

export const getAllBiotopes = async () => {
    return await prisma.biotopes.findMany();
};