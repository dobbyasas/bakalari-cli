import { printBanner } from './bannerFunctions';
import { fetchFromAPI } from './fetchFunctions';

import type { UserAuth, APITokenObject } from '../typings/authTypes';
import type { Timetable } from '../typings/timetableTypes';

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

    default:
      console.log(`Neznámý příkaz: ${keywords[0]}`)
      break;
  }
};
