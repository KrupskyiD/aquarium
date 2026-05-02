import prisma from "../../utils/prisma.js";

export const saveMetricsToDB = async (data) => {
  const { device_number, temperature, salt } = data;

  const aquarium = await prisma.aquarium.findUnique({
    where: { device_number },
  });

  if (!aquarium) return null;

  return prisma.metrics.create({
    data: {
      aquarium_id: aquarium.id,
      temperature,
      salinity: salt,
    },
  });
};
