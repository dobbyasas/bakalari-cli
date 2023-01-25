import { WEEK_DAYS } from '../main';

import type { Timetable } from '../typings/timetableTypes';

const getLongestWeekDayLength = (weekDays: string[]) => {
  return Math.max(...weekDays.map(weekDay => weekDay.length));
};

const getLongestSubjectNameLength = (subjects: Timetable['Subjects']) => {
  return Math.max(...subjects.map(subject => subject['Abbrev'].length));
};

export const formatTimetable = (timetable: Timetable, cellSpacing: number) => {
  const { Hours, Days, Subjects } = timetable;

  const longestWeekDayLength = getLongestWeekDayLength(WEEK_DAYS);
  const longestSubjectNameLength = getLongestSubjectNameLength(Subjects);

  let hourRow = ' '.repeat(longestWeekDayLength) + ' '.repeat(cellSpacing);
  Hours.forEach(hour => {
    hourRow += hour.Caption.padEnd(longestSubjectNameLength + cellSpacing, ' ');
  });
  console.log(hourRow);

  Days.forEach(day => {
    let row = `${WEEK_DAYS[day.DayOfWeek - 1]}${' '.repeat(cellSpacing)}`;
    day.Atoms.forEach(atom => {
      const subject = Subjects.find(subject => subject.Id === atom.SubjectId);
      if (subject) row += `${subject.Abbrev.padEnd(longestSubjectNameLength + cellSpacing, ' ')} `;
    });
    console.log(row);
  });
};
