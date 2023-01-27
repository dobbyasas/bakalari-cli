import { CELL_SPACING, WEEK_DAYS } from '../main';

import type { Timetable, Change } from '../typings/timetableTypes';

const getLongestWeekDayLength = (weekDays: string[]) => {
  return Math.max(...weekDays.map(weekDay => weekDay.length));
};

const getLongestSubjectNameLength = (subjects: Timetable['Subjects']) => {
  return Math.max(...subjects.map(subject => subject['Abbrev'].length));
};

export const formatTimetable = (timetable: Timetable, cellSpacing: number) => {
  const { Hours, Days, Subjects } = timetable;

  const minHour = Math.min(...Hours.map(hour => hour.Id)) ?? 0;
  const longestWeekDayLength = getLongestWeekDayLength(WEEK_DAYS);
  const longestSubjectNameLength = getLongestSubjectNameLength(Subjects);

  let hourRow = ' '.repeat(longestWeekDayLength + cellSpacing);
  Hours.forEach(hour => {
    hourRow += hour.Caption.padEnd(longestSubjectNameLength + cellSpacing, ' ');
  });
  console.log(hourRow);

  Days.forEach(day => {
    let row = `${WEEK_DAYS[day.DayOfWeek - 1]}${' '.repeat(cellSpacing)}`;
    for (let i = 0; i < Hours.length; i++) {
      const atom = day.Atoms.find(atom => atom.HourId === i + minHour);
      if (!atom) {
        row += ' '.repeat(longestSubjectNameLength + CELL_SPACING);
        continue;
      }
      const subject = Subjects.find(subject => subject.Id === atom?.SubjectId);
      row += subject
        ? `${(subject?.Abbrev ?? ' ').padEnd(longestSubjectNameLength + cellSpacing, ' ')}`
        : ' '.repeat(longestSubjectNameLength + CELL_SPACING);
    }
    console.log(row);
  });
};

export const displayChanges = (changes: Change[]) => {
  console.log(changes);
};
