import {
  C_BLACK,
  CELL_SPACING,
  COLUMN_SPACING,
  WEEK_DAYS,
  CHANGE_TYPES,
  C_RED,
  C_YELLOW,
  C_GREEN,
  C_BLUE,
  C_MAGENTA,
  C_END,
  BG_WHITE,
} from '../constants';

import type {
  Timetable,
  Subject,
  Hour,
  Change,
} from '../typings/timetableTypes';
import { FinalMarksResult } from '../typings/markTypes';
import { AbsenceResult } from '../typings/absenceTypes';

const getLongestWeekDayLength = (weekDays: string[]) => {
  return Math.max(...weekDays.map((weekDay) => weekDay.length));
};

const getLongestSubjectNameLength = (subjects: Timetable['Subjects']) => {
  return Math.max(...subjects.map((subject) => subject.Abbrev.length));
};

const getLongestRoomNameLength = (rooms: Timetable['Rooms']) => {
  return Math.max(...rooms.map((room) => room.Abbrev.length));
};

export const formatTimetable = (
  timetable: Timetable,
  cellSpacing: number,
  minimal = false,
  showRooms = false,
  currentHour?: Hour['Caption'] | null
) => {
  const { Hours, Days, Subjects, Rooms } = timetable;

  const minHour = Math.min(...Hours.map((hour) => hour.Id)) ?? 0;
  const longestWeekDayLength = getLongestWeekDayLength(WEEK_DAYS);
  const longestSubjectNameLength = getLongestSubjectNameLength(Subjects);
  const longestRoomNameLength = getLongestRoomNameLength(Rooms);

  if (!minimal) {
    let hourRow = ' '.repeat(longestWeekDayLength + cellSpacing);
    Hours.forEach((hour) => {
      hourRow += hour.Caption.padEnd(
        longestSubjectNameLength + cellSpacing,
        ' '
      );
    });
    console.log(hourRow);
  }

  Days.forEach((day) => {
    let row = minimal
      ? ''
      : `${WEEK_DAYS[day.DayOfWeek - 1]}${' '.repeat(cellSpacing)}`;
    for (let i = 0; i < Hours.length; i++) {
      const atom = day.Atoms.find((atom) => atom.HourId === i + minHour);
      const currentDate = new Date();
      const currentWeekDay =
        currentDate.getDay() > 0 ? currentDate.getDay() : 7;
      const isHourCurrent =
        i === Number(currentHour) - minHour && currentWeekDay === day.DayOfWeek;
      const hightlightStartString =
        currentHour && isHourCurrent ? `${BG_WHITE}${C_BLACK}` : '';
      const hightlightEndString = currentHour && isHourCurrent ? C_END : '';

      if (!atom) {
        row += `${hightlightStartString}${' '.repeat(
          longestSubjectNameLength
        )}${hightlightEndString}${' '.repeat(CELL_SPACING)}`;
        continue;
      }

      const subject = Subjects.find(
        (subject) => subject.Id === atom?.SubjectId
      );
      const room = Rooms.find((room) => room.Id === atom?.RoomId);

      if (!showRooms) {
        row += subject
          ? `${hightlightStartString}${(subject?.Abbrev ?? ' ').padEnd(
              longestSubjectNameLength,
              ' '
            )}${hightlightEndString}${' '.repeat(CELL_SPACING)}`
          : (() => {
              const change = atom.Change;
              if (!change || !change.TypeAbbrev)
                return `${hightlightStartString}${' '.repeat(
                  longestSubjectNameLength + CELL_SPACING
                )}${hightlightEndString}`;
              return `${hightlightStartString}${change.TypeAbbrev.padEnd(
                longestSubjectNameLength,
                ' '
              )}${hightlightEndString}${' '.repeat(CELL_SPACING)}`;
            })();
      } else {
        row += room
          ? `${hightlightStartString}${(room?.Abbrev ?? '').padEnd(
              longestRoomNameLength + cellSpacing,
              ' '
            )}${hightlightEndString}`
          : `${hightlightStartString}${'-'.repeat(
              longestRoomNameLength
            )}${' '.repeat(CELL_SPACING)}${hightlightEndString}`;
      }
    }
    console.log(row);
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
};

export const displayChanges = (changes: Change[]) => {
  changes.forEach((change) => {
    console.log(
      `${formatDate(change.Day)} (${change.Hours}): (${
        CHANGE_TYPES[change.ChangeType]
      }) ${change.Description}`
    );
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
  finalMarks.CertificateTerms.forEach((term) => {
    term.Subjects.forEach((termSubject) => {
      if (!subjectData.some((subject) => subject.name === termSubject.Name)) {
        subjectData.push({
          id: termSubject.Id,
          name: termSubject.Name,
          finalMarks: [],
        });
      }
    });
  });
  finalMarks.CertificateTerms.forEach((term) => {
    subjectData.forEach((subject) => {
      const subjectExists = term.Subjects.some(
        (termSubject) => termSubject.Id === subject.id
      );
      if (!subjectExists) {
        subject.finalMarks.push('-');
      } else {
        const markEntries = term.FinalMarks;
        subject.finalMarks.push(
          ...markEntries
            .filter((entry) => entry.SubjectId === subject.id)
            .map((subject) => subject.MarkText)
        );
      }
    });
  });

  const longestLeftColumnTitle = Math.max(
    ...subjectData.map((subject) => subject.name.length),
    'Ročník'.length,
    'Pololetí'.length
  );

  let gradeRow =
    'Ročník:'.padEnd(longestLeftColumnTitle + CELL_SPACING + 1, ' ') +
    ' '.repeat(CELL_SPACING);
  for (let i = 1; i <= totalGrades; i++) {
    gradeRow += `${i}${' '.repeat(CELL_SPACING * 2 + 1)}`;
  }
  console.log(gradeRow);

  let termNumberRow =
    'Pololetí:'.padEnd(longestLeftColumnTitle + CELL_SPACING + 1, ' ') +
    ' '.repeat(CELL_SPACING);
  finalMarks.CertificateTerms.forEach((term) => {
    termNumberRow += `${term.Semester}${' '.repeat(CELL_SPACING)}`;
  });
  console.log(`${termNumberRow}\n`);

  subjectData.forEach((subject) => {
    console.log(
      `${subject.name}:`.padEnd(
        longestLeftColumnTitle + COLUMN_SPACING + 1,
        ' '
      ) + subject.finalMarks.join(' '.repeat(CELL_SPACING))
    );
  });
};

export const formatAbsence = (
  absencesPerSubject: AbsenceResult['AbsencesPerSubject']
) => {
  const longestSubjectNameLength = Math.max(
    ...absencesPerSubject.map((subject) => subject.SubjectName.length)
  );
  const longestLessonsCountLength = Math.max(
    ...absencesPerSubject.map((subject) => String(subject.School).length)
  );
  const longestBaseLength = Math.max(
    ...absencesPerSubject.map((subject) => String(subject.Base).length)
  );
  const longestSchoolLength = Math.max(
    ...absencesPerSubject.map((subject) => String(subject.School).length)
  );
  const longestLateLength = Math.max(
    ...absencesPerSubject.map((subject) => String(subject.Late).length)
  );
  const longestSoonLength = Math.max(
    ...absencesPerSubject.map((subject) => String(subject.Soon).length)
  );
  const longestDistanceTeachingLength = Math.max(
    ...absencesPerSubject.map(
      (subject) => String(subject.DistanceTeaching).length
    )
  );

  absencesPerSubject.forEach((subject) => {
    let row = `${(subject.SubjectName + ':').padEnd(
      longestSubjectNameLength + COLUMN_SPACING + 1,
      ' '
    )}`;
    row += String(subject.LessonsCount).padEnd(
      longestLessonsCountLength + CELL_SPACING,
      ' '
    );
    row +=
      C_GREEN +
      String(subject.Base).padEnd(longestBaseLength + CELL_SPACING, ' ') +
      C_END;
    row +=
      C_BLUE +
      String(subject.School).padEnd(longestSchoolLength + CELL_SPACING, ' ') +
      C_END;
    row +=
      C_RED +
      String(subject.Late).padEnd(longestLateLength + CELL_SPACING, ' ') +
      C_END;
    row +=
      C_YELLOW +
      String(subject.Soon).padEnd(longestSoonLength + CELL_SPACING, ' ') +
      C_END;
    row +=
      C_MAGENTA +
      String(subject.DistanceTeaching).padEnd(
        longestDistanceTeachingLength + CELL_SPACING,
        ' '
      ) +
      C_END;
    console.log(row);
  });
};
