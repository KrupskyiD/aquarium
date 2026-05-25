import { getMetricsFromDB, parseDateRangeQuery } from "../model/metricsPrisma.js";

export const getMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, sensor } = req.query;

    const allowedSensors = ["temperature", "salinity"];

    if (!from || !to) {
      return res.status(400).json({
        status: "error",
        message: "Query params 'from' and 'to' are required (YYYY-MM-DD).",
      });
    }

    if (!allowedSensors.includes(sensor)) {
      return res.status(400).json({
        status: "error",
        message: "Sensor must be temperature or salinity.",
      });
    }

    try {
      parseDateRangeQuery(from, to);
    } catch (rangeError) {
      return res.status(400).json({
        status: "error",
        message: rangeError.message,
      });
    }

    const result = await getMetricsFromDB(id, from, to, sensor);

    res.status(200).json({
      status: "success",
      data: {
        sensor,
        from,
        to,
        min: result.aggregate._min[sensor],
        max: result.aggregate._max[sensor],
        avg: result.aggregate._avg[sensor],
        series: result.series,
        range: result.range,
        granularity: result.granularity,
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
