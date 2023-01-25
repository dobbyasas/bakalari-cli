import { printBanner } from './bannerFunctions';
import { fetchFromAPI } from './fetchFunctions';

import type { UserAuth, APITokenObject } from '../typings/authTypes';

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

    case 'test': {
      const data = await fetchFromAPI(auth, token, 'timetable/actual');
      console.log(data);
      break;
    }

    default:
      console.log(`Neznámý příkaz: ${keywords[0]}`)
      break;
  }
};
