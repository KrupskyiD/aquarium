import prisma from "../../utils/prisma.js";

export const getMetricsFromDB = async (aquariumId, period, sensor) => {
  const hours = period === "30" ? 30 * 24 : period === "7" ? 7 * 24 : 24;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const result = await prisma.metrics.aggregate({
    where: {
      aquarium_id: parseInt(aquariumId),
      created_at: { gte: since },
    },
    _min: { [sensor]: true },
    _max: { [sensor]: true },
    _avg: { [sensor]: true },
  });

  return result;
};

export const saveMetricsToDB = async (data) => {
  return await prisma.metrics.create({
    data: {
      aquarium: {
        connect: {
          device_serial: data.device_serial,
        },
      },
      temperature: data.temperature,
      salinity: data.salt,
    },
  });
};
