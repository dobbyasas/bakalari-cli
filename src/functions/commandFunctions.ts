import { printBanner } from './bannerFunctions';
import {
  formatTimetable,
  formatChanges,
  formatFinalMarks,
  formatAbsence,
} from './formattingFunctions';
import {
  getPreviousWeekFormattedDate,
  getNextWeekFormattedDate,
  getFormattedDate,
  getCurrentHourNumber,
} from './dateFunctions';
import { fetchFromAPI } from './fetchFunctions';
import { deleteAuth } from './authFunctions';
import { shell } from '../main';
import {
  HOSTNAME,
  RELEASE_NUMBER,
  CELL_SPACING,
  APP_LOGO,
  COLUMN_SPACING,
  EN_COMMANDS,
  COMMAND_LOOKUP_TABLE,
  C_RED,
  C_YELLOW,
  C_GREEN,
  C_BLUE,
  C_MAGENTA,
  C_END,
} from '../constants';

import type { UserAuth } from '../typings/authTypes';
import type { APITokenObject, APIVersionResult } from '../typings/apiTypes';
import type { Hour } from '../typings/timetableTypes';
import {
  TimetableResult,
  MarksResult,
  FinalMarksResult,
  AbsenceResult,
  SubstitutionsResult,
  SubjectsResult,
} from '../typings/apiTypes';

export const handleCommand = async (
  keywords: string[],
  options: string[],
  auth: UserAuth,
  token: APITokenObject['access_token'],
  quitFunction: () => void,
  loginFunction: () => Promise<unknown>
) => {
  if (keywords.length === 0) return;
  switch (keywords[0].toLowerCase()) {
    case 'help':
    case 'napoveda': {
      const lowercaseKeywords = keywords.map((keyword) =>
        keyword.toLowerCase()
      );

      if (lowercaseKeywords.length === 1) {
        printBanner('help');
        return;
      }
      const command = EN_COMMANDS.includes(lowercaseKeywords[1])
        ? lowercaseKeywords[1]
        : COMMAND_LOOKUP_TABLE[
            lowercaseKeywords[1] as keyof typeof COMMAND_LOOKUP_TABLE
          ] ?? lowercaseKeywords[1];
      const bannerExists = printBanner(`commands/${command}`, {
        displayError: false,
      });
      if (!bannerExists)
        console.log(
          `Nápověda pro příkaz ${lowercaseKeywords[1]} zatím neexistuje!`
        );
      break;
    }

    case 'hours':
    case 'hodiny': {
      const { Hours } = (await fetchFromAPI(
        auth,
        token,
        '/timetable/actual'
      )) as TimetableResult;
      if (!Hours) return;
      Hours.forEach((hour) => {
        console.log(`${hour.Caption}: ${hour.BeginTime}-${hour.EndTime}`);
      });
      break;
    }

    case 'teachers':
    case 'ucitele': {
      const { Teachers } = (await fetchFromAPI(
        auth,
        token,
        '/timetable/permanent'
      )) as TimetableResult;
      if (!Teachers) return;
      Teachers.forEach((teacher) => {
        console.log(`${teacher.Abbrev} - ${teacher.Name}`);
      });
      break;
    }

    case 'subjects':
    case 'predmety': {
      const { Subjects } = (await fetchFromAPI(
        auth,
        token,
        '/subjects'
      )) as SubjectsResult;
      Subjects.forEach((subject) => {
        console.log(`${subject.SubjectName} (${subject.SubjectAbbrev})`);
        console.log(`${subject.TeacherName} (${subject.TeacherAbbrev})`);
      });
      break;
    }

    case 'timetable':
    case 'rozvrh': {
      let timetable: TimetableResult | null = null;
      let currentHour: Hour['Id'] | null = null;

      // Checking if the [s, p, n] options are not used at the same time
      if (
        options.filter((option) => ['s', 'p', 'n'].includes(option)).length > 1
      ) {
        console.log(`${keywords[0]}: Možnosti -s, -p a -n nelze kombinovat!`);
        return;
      }

      if (options.includes('s')) {
        timetable = (await fetchFromAPI(
          auth,
          token,
          '/timetable/permanent'
        )) as TimetableResult;
      } else if (options.includes('p')) {
        const previousWeekDate = getPreviousWeekFormattedDate();
        timetable = (await fetchFromAPI(
          auth,
          token,
          `/timetable/actual?date=${previousWeekDate}`
        )) as TimetableResult;
      } else if (options.includes('n')) {
        const nextWeekDate = getNextWeekFormattedDate();
        timetable = (await fetchFromAPI(
          auth,
          token,
          `/timetable/actual?date=${nextWeekDate}`
        )) as TimetableResult;
      } else {
        timetable = (await fetchFromAPI(
          auth,
          token,
          '/timetable/actual'
        )) as TimetableResult;
        currentHour = getCurrentHourNumber(timetable.Hours);
      }
      if (!timetable) return;
      formatTimetable(
        timetable,
        CELL_SPACING,
        options.includes('m'),
        options.includes('r'),
        currentHour ? currentHour.toString() : null
      );
      break;
    }

    case 'marks':
    case 'znamky': {
      const marks = (await fetchFromAPI(auth, token, '/marks')) as MarksResult;
      if (!marks) return;
      if (keywords.length === 1) {
        const longestSubjectNameLength = Math.max(
          ...marks.Subjects.map((subject) => subject.Subject.Abbrev.length)
        );

        marks.Subjects.forEach((subject) => {
          let row =
            (subject.Subject.Abbrev.trimEnd() + ':').padEnd(
              longestSubjectNameLength + 1,
              ' '
            ) +
            ' '.repeat(CELL_SPACING) +
            subject.AverageText +
            ' '.repeat(COLUMN_SPACING);
          if (options.includes('l')) {
            subject.Marks.forEach((mark) => {
              row += mark.MarkText.padEnd(2 + CELL_SPACING, ' ');
            });
          }
          console.log(row);
        });
      } else {
        const subjectName = keywords[1].toLowerCase();
        const targetSubject = marks.Subjects.find(
          (subject) =>
            subject.Subject.Abbrev.trimEnd().toLowerCase() === subjectName
        );
        if (!targetSubject) {
          console.log(`Předmět ${subjectName.toUpperCase()} nebyl nalezen!`);
          return;
        }

        const longestMarkTextLength = Math.max(
          ...targetSubject.Marks.map((mark) => mark.MarkText.length)
        );
        const longestMarkCaptionLength = Math.max(
          ...targetSubject.Marks.map((mark) => mark.Caption.length)
        );
        const longestMarkWeightLength = Math.max(
          ...targetSubject.Marks.map((mark) => String(mark.Weight).length)
        );

        if (!options.includes('m'))
          console.log(targetSubject.Subject.Name + '\n');

        targetSubject.Marks.forEach((mark) => {
          console.log(
            `${mark.MarkText.padEnd(
              longestMarkTextLength + CELL_SPACING,
              ' '
            )}${`(Váha: ${mark.Weight}):`.padEnd(
              9 + longestMarkWeightLength + CELL_SPACING,
              ' '
            )}${mark.Caption.padEnd(
              longestMarkCaptionLength + COLUMN_SPACING,
              ' '
            )}(${getFormattedDate(mark.MarkDate)})`
          );
        });

        if (!options.includes('m'))
          console.log(`\nPrůměr: ${targetSubject.AverageText}`);
      }
      break;
    }

    case 'changes':
    case 'zmeny': {
      const { Changes } = (await fetchFromAPI(
        auth,
        token,
        '/substitutions'
      )) as SubstitutionsResult;
      if (!Changes) return;
      formatChanges(Changes);
      break;
    }

    case 'final':
    case 'pololeti': {
      const finalMarks = (await fetchFromAPI(
        auth,
        token,
        '/marks/final'
      )) as FinalMarksResult;
      if (!finalMarks) return;
      formatFinalMarks(finalMarks);
      break;
    }

    case 'absence': {
      const { AbsencesPerSubject } = (await fetchFromAPI(
        auth,
        token,
        '/absence/student'
      )) as AbsenceResult;
      if (!AbsencesPerSubject) return;
      printBanner('absenceLegend', {
        newLine: true,
        placeholders: {
          end: C_END,
          baseColor: C_GREEN,
          schoolColor: C_BLUE,
          lateColor: C_RED,
          soonColor: C_YELLOW,
          distanceColor: C_MAGENTA,
        },
      });
      formatAbsence(AbsencesPerSubject);
      break;
    }

    case 'events': {
      const events = (await fetchFromAPI(
        auth,
        token,
        '/substitutions'
      )) as TimetableResult;
      if (!events) return;
      console.log(events);
      break;
    }

    case 'bfetch': {
      const apiInfo = (await fetchFromAPI(auth, token, '')) as APIVersionResult;
      if (!apiInfo) return;

      const hostLine = `${C_BLUE}${auth.userName}${C_END}@${C_BLUE}${HOSTNAME}${C_BLUE}`;
      const dataLines = [
        hostLine,
        '-'.repeat(`${auth.userName}@${HOSTNAME}`.length),
        `${C_BLUE}API Version${C_END}: ${apiInfo.ApiVersion}`,
        `${C_BLUE}Bakaláři CLI Version${C_END}: ${RELEASE_NUMBER}`,
      ];

      APP_LOGO.forEach((line, index) => {
        console.log(
          `${line}${' '.repeat(COLUMN_SPACING)}${dataLines[index] ?? ''}`
        );
      });
      break;
    }

    case 'clear':
    case 'cls': {
      console.clear();
      break;
    }

    case 'logout':
    case 'odhlasit': {
      deleteAuth();
      console.log('Byl jste úspěšně odhlášen.');
      console.log('Chcete se znovu přihlásit? [Y/n]');

      const response = shell.getInput();
      if (response.length && response[0].trim().toLowerCase() === 'n') {
        quitFunction();
        break;
      }

      console.log('');
      await loginFunction();

      break;
    }

    case 'exit':
      quitFunction();
      break;

    default:
      console.log(`Neznámý příkaz: ${keywords[0]}`);
      break;
  }
};
