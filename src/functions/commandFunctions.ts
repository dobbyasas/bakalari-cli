import { printBanner } from './bannerFunctions.js';
import {
  formatTimetable,
  formatChanges,
  formatFinalMarks,
  formatAbsence,
  columnifyData,
} from './formattingFunctions.js';
import {
  getPreviousWeekFormattedDate,
  getNextWeekFormattedDate,
  getFormattedDate,
  getCurrentHourNumber,
} from './dateFunctions.js';
import { fetchFromAPI } from './fetchFunctions.js';
import { deleteAuth } from './authFunctions.js';
import { shell } from '../main.js';
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
} from '../constants.js';

import type { UserAuth } from '../typings/authTypes.js';
import type { APITokenObject, APIVersionResult } from '../typings/apiTypes.js';
import type { Hour } from '../typings/timetableTypes.js';
import {
  TimetableResult,
  MarksResult,
  FinalMarksResult,
  AbsenceResult,
  SubstitutionsResult,
  SubjectsResult,
} from '../typings/apiTypes.js';

export const handleCommand = async (
  keywords: string[],
  options: string[],
  auth: UserAuth,
  token: APITokenObject['access_token'],
  quitFunction: () => void,
  loginFunction: () => Promise<unknown>,
  completionFunction: () => void
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
      completionFunction();
      if (!Hours) return;
      columnifyData(
        [
          Hours.map((hour) => hour.Caption + ':'),
          Hours.map((hour) => `${hour.BeginTime}:${hour.EndTime}`),
        ],
        CELL_SPACING
      );
      break;
    }

    case 'teachers':
    case 'ucitele': {
      const { Teachers } = (await fetchFromAPI(
        auth,
        token,
        '/timetable/permanent'
      )) as TimetableResult;
      completionFunction();
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
      completionFunction();
      if (!Subjects) return;
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
      completionFunction();
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
      completionFunction();
      if (!marks) return;
      if (keywords.length === 1) {
        columnifyData(
          [
            marks.Subjects.map((subject) => subject.Subject.Abbrev),
            marks.Subjects.map((subject) => subject.AverageText),
            marks.Subjects.map((subject) =>
              subject.Marks.map((mark) => mark.MarkText.padEnd(2, ' ')).join(
                ' '.repeat(CELL_SPACING)
              )
            ),
          ],
          CELL_SPACING,
          [
            {
              position: 1,
              size: COLUMN_SPACING,
            },
          ]
        );
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

        if (!options.includes('m'))
          console.log(targetSubject.Subject.Name + '\n');

        columnifyData(
          [
            targetSubject.Marks.map((mark) => mark.MarkText),
            targetSubject.Marks.map((mark) => `(Váha: ${String(mark.Weight)})`),
            targetSubject.Marks.map((mark) => mark.Caption),
            targetSubject.Marks.map(
              (mark) => `[${getFormattedDate(mark.MarkDate)}]`
            ),
          ],
          CELL_SPACING,
          [
            {
              position: 2,
              size: COLUMN_SPACING,
            },
          ]
        );

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
      completionFunction();
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
      completionFunction();
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
      completionFunction();
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
      completionFunction();
      if (!events) return;
      console.log(events);
      break;
    }

    case 'komens': {
      const { Messages } = (await fetchFromAPI(
        auth,
        token,
        '/komens/messages/received',
        'POST'
      )) as KomensResult;
      if (!Messages) return;
      Messages.forEach((message) => {
        console.log(message.RelevantName);
        console.log(message.Title);
        console.log(
          message.Text.replace(/<[^>]*>/g, '').replace(/\s\s+/g, ' ')
        );
      });
      break;
    }

    case 'bfetch': {
      const apiInfo = (await fetchFromAPI(auth, token, '')) as APIVersionResult;
      completionFunction();
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
      completionFunction();
      console.clear();
      break;
    }

    case 'logout':
    case 'odhlasit': {
      completionFunction();
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
      completionFunction();
      quitFunction();
      break;

    default:
      completionFunction();
      console.log(`Neznámý příkaz: ${keywords[0]}`);
      break;
  }
};
