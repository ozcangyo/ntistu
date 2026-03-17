import { addDays, differenceInMinutes, formatDistanceToNowStrict, parse } from "date-fns";

export function nextDoseFromTimes(times: string[]) {
  const now = new Date();
  const candidates = times
    .map((t) => parse(t, "HH:mm", now))
    .map((d) => (d < now ? addDays(d, 1) : d))
    .sort((a, b) => a.getTime() - b.getTime());
  const next = candidates[0];
  return {
    next,
    minutesRemaining: differenceInMinutes(next, now),
    humanRemaining: formatDistanceToNowStrict(next)
  };
}

export function scheduleDatesForDay(date: Date, times: string[]) {
  return times.map((t) => parse(t, "HH:mm", date));
}
