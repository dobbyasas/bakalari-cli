import { CELL_SPACING } from '../main';

import type { Timetable } from '../typings/timetableTypes';

const getLongestSubjectNameLength = (subjects: Timetable['Subjects']) => {
  return Math.max(...subjects.map(subject => subject['Abbrev'].length));
};

export const formatTimetable = (timetable: Timetable) => {
  const { Days, Subjects } = timetable;
  const longestSubjectNameLength = getLongestSubjectNameLength(Subjects);

  Days.forEach(day => {
    let row = '';
    day.Atoms.forEach(atom => {
      const subject = Subjects.find(subject => subject.Id === atom.SubjectId);
      if (subject) row += `${subject.Abbrev.padEnd(longestSubjectNameLength + CELL_SPACING, ' ')} `;
    });
    console.log(row);
  });
};
