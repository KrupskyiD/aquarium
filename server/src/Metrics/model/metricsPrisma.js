import prisma from "../../utils/prisma.js";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const parseDateRangeQuery = (from, to) => {
  if (!ISO_DATE_RE.test(from) || !ISO_DATE_RE.test(to)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD.");
  }

  const [fromY, fromM, fromD] = from.split("-").map(Number);
  const [toY, toM, toD] = to.split("-").map(Number);

  const since = new Date(fromY, fromM - 1, fromD, 0, 0, 0, 0);
  const until = new Date(toY, toM - 1, toD, 23, 59, 59, 999);

  if (Number.isNaN(since.getTime()) || Number.isNaN(until.getTime())) {
    throw new Error("Invalid date values.");
  }

  if (since > until) {
    throw new Error("'from' must be before or equal to 'to'.");
  }

  const maxSpanMs = 366 * 24 * 60 * 60 * 1000;
  if (until.getTime() - since.getTime() > maxSpanMs) {
    throw new Error("Date range cannot exceed 366 days.");
  }

  return { since, until };
};

const getSeriesGranularity = (since, until) => {
  const spanMs = until.getTime() - since.getTime();
  const spanDays = spanMs / (24 * 60 * 60 * 1000) + 1;

  if (spanDays <= 1.05) return "hour";
  if (spanDays <= 14) return "raw";
  return "day";
};

const buildWhere = (aquariumId, since, until) => ({
  aquarium_id: parseInt(aquariumId, 10),
  created_at: {
    gte: since,
    lte: until,
  },
});

const formatSeriesLabel = (date, granularity) => {
  if (granularity === "hour") {
    return date.toLocaleString("cs-CZ", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "short",
  });
};

const bucketSeriesByDay = (rows, sensor) => {
  const buckets = new Map();

  for (const row of rows) {
    const date = row.created_at;
    if (!date) continue;

    const key = date.toISOString().slice(0, 10);
    const value = Number(row[sensor]);
    if (!Number.isFinite(value)) continue;

    const bucket = buckets.get(key) ?? { sum: 0, count: 0, date };
    bucket.sum += value;
    bucket.count += 1;
    buckets.set(key, bucket);
  }

  return Array.from(buckets.values())
    .sort((a, b) => a.date - b.date)
    .map((bucket) => ({
      value: bucket.sum / bucket.count,
      at: bucket.date,
    }));
};

const mapRowsToSeries = (rows, sensor, granularity) => {
  const points =
    granularity === "day"
      ? bucketSeriesByDay(rows, sensor)
      : rows
          .map((row) => ({
            value: Number(row[sensor]),
            at: row.created_at,
          }))
          .filter((point) => point.at && Number.isFinite(point.value));

  return points.map((point) => ({
    label: formatSeriesLabel(point.at, granularity),
    value: point.value,
    at: point.at.toISOString(),
  }));
};

export const getMetricsFromDB = async (aquariumId, from, to, sensor) => {
  const { since, until } = parseDateRangeQuery(from, to);
  const granularity = getSeriesGranularity(since, until);
  const where = buildWhere(aquariumId, since, until);

  const [aggregate, rows] = await Promise.all([
    prisma.metrics.aggregate({
      where,
      _min: { [sensor]: true },
      _max: { [sensor]: true },
      _avg: { [sensor]: true },
    }),
    prisma.metrics.findMany({
      where,
      orderBy: { created_at: "asc" },
      select: {
        created_at: true,
        [sensor]: true,
      },
      take: 2000,
    }),
  ]);

  return {
    aggregate,
    series: mapRowsToSeries(rows, sensor, granularity),
    range: {
      from,
      to,
      since: since.toISOString(),
      until: until.toISOString(),
    },
    granularity,
  };
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
