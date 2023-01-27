import { printBanner } from './bannerFunctions';
import { fetchFromAPI } from './fetchFunctions';
import { formatTimetable, displayChanges } from './formattingFunctions';
import { CELL_SPACING } from '../main';

import type { UserAuth, APITokenObject } from '../typings/authTypes';
import type { Timetable, Change } from '../typings/timetableTypes';

export const handleCommand = async (
  keywords: string[],
  options: string[],
  auth: UserAuth,
  token: APITokenObject['access_token'],
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

    default:
      console.log(`Neznámý příkaz: ${keywords[0]}`)
      break;
  }
}
