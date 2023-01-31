import {
  CELL_SPACING,
  COLUMN_SPACING,
  WEEK_DAYS,
  CHANGE_TYPES,
} from '../constants';

import type { Timetable, Subject, Change } from '../typings/timetableTypes';
import { FinalMarksResult } from '../typings/markTypes';

const getLongestWeekDayLength = (weekDays: string[]) => {
  return Math.max(...weekDays.map(weekDay => weekDay.length));
};

const getLongestSubjectNameLength = (subjects: Timetable['Subjects']) => {
  return Math.max(...subjects.map(subject => subject.Abbrev.length));
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
        : (() => {
          const change = atom.Change;
          if (!change || !change.TypeAbbrev) return ' '.repeat(longestSubjectNameLength + CELL_SPACING);
          return change.TypeAbbrev.padEnd(longestSubjectNameLength + cellSpacing, ' ');
        })();
    }
    console.log(row);
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
};

export const displayChanges = (changes: Change[]) => {
  changes.forEach(change =>  {
    console.log(`${formatDate(change.Day)} (${change.Hours}): (${CHANGE_TYPES[change.ChangeType]}) ${change.Description}`);
  });
};

export const formatFinalMarks = (finalMarks: FinalMarksResult) => {
  const totalTerms = finalMarks.CertificateTerms.length;
  const totalGrades = Math.ceil(totalTerms / 2);

  const subjectData: {
    id: Subject['Id'];
    name: Subject['Name'];
    finalMarks: string[];
  }[] = [];

  // Gets marks for every subject each term
  finalMarks.CertificateTerms.forEach(term => {
    term.Subjects.forEach(termSubject => {
      if (!subjectData.some(subject => subject.name === termSubject.Name)) {
        subjectData.push({
          id: termSubject.Id,
          name: termSubject.Name,
          finalMarks: [],
        });
      }
    });
  });
  finalMarks.CertificateTerms.forEach(term => {
    subjectData.forEach(subject => {
      const subjectExists = term.Subjects.some(termSubject => termSubject.Id === subject.id);
      if (!subjectExists) {
        subject.finalMarks.push('-');
      } else {
        const markEntries = term.FinalMarks;
        subject.finalMarks.push(
          ...markEntries.filter(entry => entry.SubjectId === subject.id).map(subject => subject.MarkText)
        );
      }
    });
  });

  const longestLeftColumnTitle = Math.max(
    ...subjectData.map(subject => subject.name.length),
    'Ročník'.length,
    'Pololetí'.length,
  );

  let gradeRow = 'Ročník:'.padEnd(longestLeftColumnTitle + CELL_SPACING + 1, ' ') + ' '.repeat(CELL_SPACING);
  for (let i = 1; i <= totalGrades; i++) {
    gradeRow += `${i}${' '.repeat(CELL_SPACING * 2 + 1)}`;
  }
  console.log(gradeRow);

  let termNumberRow = 'Pololetí:'.padEnd(longestLeftColumnTitle + CELL_SPACING + 1, ' ') + ' '.repeat(CELL_SPACING);
  finalMarks.CertificateTerms.forEach(term => {
    termNumberRow += `${term.Semester}${' '.repeat(CELL_SPACING)}`;
  });
  console.log(`${termNumberRow}\n`);

  subjectData.forEach(subject => {
    console.log(`${subject.name}:`.padEnd(longestLeftColumnTitle + COLUMN_SPACING + 1, ' ') + subject.finalMarks.join(' '.repeat(CELL_SPACING)));
  });
};

export const getPreviousWeekFormattedDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const getNextWeekFormattedDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
