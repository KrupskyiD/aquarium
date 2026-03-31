import prisma from "../utils/prisma.js";

export const getMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    const { period, sensor } = req.query;

    const allowedPeriods = ["24", "7", "30"];
    const allowedSensors = ["temperature", "salinity"];

    if (!allowedPeriods.includes(period)) {
      return res.status(400).json({
        status: "error",
        message: "Period must be 24, 7 or 30.",
      });
    }

    if (!allowedSensors.includes(sensor)) {
      return res.status(400).json({
        status: "error",
        message: "Sensor must be temperature or salinity.",
      });
    }

    const hours = period === "30" ? 30 * 24 : period === "7" ? 7 * 24 : 24;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const result = await prisma.metrics.aggregate({
      where: {
        aquarium_id: parseInt(id),
        created_at: { gte: since },
      },
      _min: { [sensor]: true },
      _max: { [sensor]: true },
      _avg: { [sensor]: true },
    });

    res.status(200).json({
      status: "success",
      data: {
        sensor,
        period,
        min: result._min[sensor],
        max: result._max[sensor],
        avg: result._avg[sensor],
      },
    });
  } catch (e) {
    console.log(`Error getting metrics: ${e}`);
    res.status(500).json({
      status: "error",
      message: "Cannot get metrics",
    });
  }
};

export const createMetric = async (req, res) => {
  try {
    const { id } = req.params;
    const { temperature, salinity } = req.body;

    if (temperature === undefined || salinity === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Temperature and salinity are required",
      });
    }

    const metric = await prisma.metrics.create({
      data: {
        aquarium_id: parseInt(id),
        temperature,
        salinity,
      },
    });

    res.status(201).json({
      status: "success",
      data: metric,
    });
  } catch (e) {
    console.log(`Error creating metric: ${e}`);
    res.status(500).json({
      status: "error",
      message: "Cannot save metric",
    });
  }
};
