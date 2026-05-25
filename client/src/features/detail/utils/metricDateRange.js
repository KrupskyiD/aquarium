export const RANGE_MODES = [
  { id: "day", label: "Den" },
  { id: "week", label: "Týden" },
  { id: "month", label: "Měsíc" },
];

export const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const todayIsoDate = () => toIsoDate(new Date());

export const currentIsoMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const parseLocalDate = (isoDate) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

export const resolvePickerRange = ({ mode, pickDate, pickMonth }) => {
  if (mode === "month") {
    const [year, month] = pickMonth.split("-").map(Number);
    const since = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const until = new Date(year, month, 0, 23, 59, 59, 999);
    return {
      from: toIsoDate(since),
      to: toIsoDate(until),
      mode,
    };
  }

  const anchor = parseLocalDate(pickDate);

  if (mode === "day") {
    return {
      from: pickDate,
      to: pickDate,
      mode,
    };
  }

  const dayOfWeek = anchor.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    from: toIsoDate(monday),
    to: toIsoDate(sunday),
    mode,
  };
};

export const formatRangeSummary = ({ mode, from, to }) => {
  const fromDate = parseLocalDate(from);
  const toDate = parseLocalDate(to);
  const fmt = (date, options) => date.toLocaleDateString("cs-CZ", options);

  if (mode === "month") {
    return fmt(fromDate, { month: "long", year: "numeric" });
  }

  if (from === to) {
    return fmt(fromDate, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const sameYear = fromDate.getFullYear() === toDate.getFullYear();
  const startFmt = fmt(fromDate, {
    day: "numeric",
    month: "long",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  const endFmt = fmt(toDate, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${startFmt} – ${endFmt}`;
};

export const formatPickerAnchorLabel = ({ mode, pickDate, pickMonth }) => {
  if (mode === "month") {
    const [year, month] = pickMonth.split("-").map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString("cs-CZ", { month: "long", year: "numeric" });
  }

  const date = parseLocalDate(pickDate);
  if (mode === "day") {
    return date.toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  }

  const { from, to } = resolvePickerRange({ mode, pickDate, pickMonth });
  return formatRangeSummary({ mode, from, to });
};

const clampToToday = (isoDate) => {
  const today = todayIsoDate();
  return isoDate > today ? today : isoDate;
};

export const shiftPicker = ({ mode, pickDate, pickMonth, direction }) => {
  if (mode === "month") {
    const [year, month] = pickMonth.split("-").map(Number);
    const next = new Date(year, month - 1 + direction, 1);
    const today = new Date();
    if (
      next.getFullYear() > today.getFullYear() ||
      (next.getFullYear() === today.getFullYear() && next.getMonth() > today.getMonth())
    ) {
      return { mode, pickDate, pickMonth };
    }
    return {
      mode,
      pickDate: toIsoDate(next),
      pickMonth: `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`,
    };
  }

  const anchor = parseLocalDate(pickDate);
  const step = mode === "day" ? direction : direction * 7;
  anchor.setDate(anchor.getDate() + step);

  const nextDate = clampToToday(toIsoDate(anchor));
  const parsed = parseLocalDate(nextDate);

  return {
    mode,
    pickDate: nextDate,
    pickMonth: `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`,
  };
};

export const canShiftForward = ({ mode, pickDate, pickMonth }) => {
  const shifted = shiftPicker({ mode, pickDate, pickMonth, direction: 1 });
  if (mode === "month") return shifted.pickMonth !== pickMonth;
  return shifted.pickDate !== pickDate;
};

export const jumpToCurrent = (mode) => {
  const today = todayIsoDate();
  return { mode, pickDate: today, pickMonth: currentIsoMonth() };
};

export const isCurrentPeriod = ({ mode, pickDate, pickMonth }) => {
  const today = todayIsoDate();
  const month = currentIsoMonth();

  if (mode === "day") return pickDate === today;
  if (mode === "month") return pickMonth === month;

  const current = resolvePickerRange({ mode: "week", pickDate: today, pickMonth: month });
  const selected = resolvePickerRange({ mode, pickDate, pickMonth });
  return current.from === selected.from && current.to === selected.to;
};
