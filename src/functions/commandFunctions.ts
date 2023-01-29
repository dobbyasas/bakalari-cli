import { printBanner } from './bannerFunctions';
import { formatTimetable, displayChanges, formatFinalMarks } from './formattingFunctions';
import { fetchFromAPI } from './fetchFunctions';
import { deleteAuth } from './authFunctions';
import { shell } from '../main';
import { CELL_SPACING, APP_LOGO } from '../constants';

import type { UserAuth, APITokenObject } from '../typings/authTypes';
import type { Timetable, Change } from '../typings/timetableTypes';
import type { FinalMarksResult } from '../typings/markTypes';

export const handleCommand = async (
  keywords: string[],
  options: string[],
  auth: UserAuth,
  token: APITokenObject['access_token'],
  quitFunction: () => void,
  loginFunction: () => Promise<unknown>,
) => {
  if (keywords.length === 0) return;
  switch (keywords[0].toLowerCase()) {
    case 'help':
    case 'napoveda':
      printBanner('help');
      break;

    case 'hours':
    case 'hodiny': {
      const { Hours } = await fetchFromAPI(auth, token, 'timetable/actual') as Timetable;
      if (!Hours) break;
      Hours.forEach(hour => {
        console.log(`${hour.Caption}: ${hour.BeginTime}-${hour.EndTime}`);
      });
      break;
    }

    case 'teachers':
    case 'ucitele': {
      const { Teachers } = await fetchFromAPI(auth, token, 'timetable/permanent') as Timetable;
      if (!Teachers) break;
      Teachers.forEach(teacher => {
        console.log(`${teacher.Abbrev} - ${teacher.Name}`);
      });
      break;
    }

    case 'timetable':
    case 'rozvrh': {
      const timetable = await fetchFromAPI(auth, token, 'timetable/actual') as Timetable;
      if (!timetable) return;
      formatTimetable(timetable, CELL_SPACING);
      break;
    }

    case 'changes':
    case 'zmeny': {
      const timetable = await fetchFromAPI(auth, token, 'timetable/actual') as Timetable;
      if (!timetable) return;
      const changes: Change[] = [];
      timetable.Days.map(day => day.Atoms.map(atom => atom.Change)).forEach(change => {
        change.forEach(item => {
          if (item) changes.push(item);
        });
      });
      displayChanges(changes);
      break;
    }

    case 'final':
    case 'pololeti': {
      const finalMarks = await fetchFromAPI(auth, token, 'marks/final') as FinalMarksResult;
      if (!finalMarks) return;
      formatFinalMarks(finalMarks);
      break;
    }

    case 'bfetch': {
      APP_LOGO.forEach(line => {
        console.log(line);
      });
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
      console.log(`Neznámý příkaz: ${keywords[0]}`)
      break;
  }
};
