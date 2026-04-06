import prisma from '../../utils/prisma.js'

//saving new metrics to table metrics
export default async (data) => {
    //bringinng up keys from data object
    const { device_serial, temperature, salt, timestamp } = data;

    const newMetrics = prisma.metrics.create({
        data: {
            aquarium: {
                //finding out aquarium_id by using connect, which will find the if by unique serial device :^
                connect: {
                    device_serial: device_serial
                }
            },
            temperature: temperature,
            salinity: salt,
            //saving date, which was created at gateway or arduino layer. Perhaps will be implemented later
            //created_at: timestamp,
        }
    });

    return newMetrics;
};









//if it'll be needed in a future to do a two-step finding aquarium_id
/** 
 * // src/models/telemetryModel.js
import prisma from '../db.js'; // Твой файл с подключением к БД

// Экспортируем функцию, которая принимает объект data
export const saveTelemetryToDB = async (data) => {
  // Вытаскиваем нужные поля из переданного объекта
  const { device_serial, temperature, salinity } = data;

  // 1. Ищем аквариум
  const aquarium = await prisma.aquarium.findFirst({
    where: { device_serial: device_serial }
  });

  if (!aquarium) {
    // Если аквариума нет, просто бросаем ошибку. 
    // Контроллер её поймает и решит, какой статус-код отдать.
    throw new Error('UNREGISTERED_DEVICE');
  }

  // 2. Сохраняем метрику
  const newMetric = await prisma.metricks.create({
    data: {
      temperature: temperature,
      salinity: salinity,
      aquarium_id: aquarium.id 
    }
  });

  // Возвращаем сохраненную запись
  return newMetric;
};
 * */ 