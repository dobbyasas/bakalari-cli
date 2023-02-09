import type { Hour } from '../typings/timetableTypes.js';

export const getFormattedDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
};

export const getPreviousWeekFormattedDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`;
};

export const getNextWeekFormattedDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`;
};

export const getCurrentHourNumber = (
  timetableHours: Hour[]
): Hour['Id'] | null => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  let lastHour: Hour['Id'] | null = null;

  if (!timetableHours || !timetableHours.length) return null;
  const [maxHours, maxMinutes] = timetableHours
    .slice(-1)[0]
    .BeginTime.split(':')
    .map((timeNumber) => Number(timeNumber));

  if (hours > maxHours || (hours === maxHours && minutes > maxMinutes)) {
    return null;
  }

  timetableHours.forEach((timetableHour) => {
    const [tHours, tMinutes] = timetableHour.BeginTime.split(':').map(
      (timeNumber) => Number(timeNumber)
    );

    if (hours > tHours) {
      lastHour = timetableHour['Id'];
    } else if (hours === tHours && minutes > tMinutes) {
      lastHour = timetableHour['Id'];
    }
  });

  return lastHour;
};
