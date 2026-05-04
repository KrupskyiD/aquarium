import { getMetricsFromDB } from "../model/metricsPrisma.js";

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

    const result = await getMetricsFromDB(id, period, sensor);

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
