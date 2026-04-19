import prisma from "../../utils/prisma.js";

export const getAllAquariums = async (userId) => {
  return prisma.aquarium.findMany({
    where: { user_id: userId },
    orderBy: { id: "asc" },
  });
};

export const getAquariumById = async (id, userId) => {
  return prisma.aquarium.findFirst({
    where: {
      id: parseInt(id, 10),
      user_id: userId,
    },
  });
};

/**
 * Create aquarium row from SaltGuard dashboard payload (overview feature).
 */
export const createAquarium = async (data, userId) => {
  return prisma.aquarium.create({
    data: {
      name: data.name,
      user_id: userId,
      volume: data.volume,
      water_type: data.water_type,
      notes: data.notes ?? null,
      device_number: data.device_number,
      connection_status: data.connection_status ?? "offline",
      min_salt: data.min_salt ?? null,
      max_salt: data.max_salt ?? null,
      min_temp: data.min_temp ?? null,
      max_temp: data.max_temp ?? null,
    },
  });
};

export const updateAquarium = async (id, data, userId) => {
  const existing = await getAquariumById(id, userId);
  if (!existing) return null;
  return prisma.aquarium.update({
    where: { id: existing.id },
    data,
  });
};

export const deleteAquarium = async (id, userId) => {
  const result = await prisma.aquarium.deleteMany({
    where: {
      id: parseInt(id, 10),
      user_id: userId,
    },
  });
  return result.count > 0;
};
