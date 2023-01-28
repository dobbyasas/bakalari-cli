import { Shell } from './shell';
import { printBanner } from './functions/bannerFunctions';
import {
  getAuthFromCache,
  getAuthFromInput
} from './functions/authFunctions';
import { fetchToken } from './functions/fetchFunctions';
import { saveAuth } from './functions/authFunctions';
import { handleCommand } from './functions/commandFunctions';

import { UserAuth, APITokenObject } from './typings/authTypes';
import type { Change } from './typings/timetableTypes';

// Constants
export const shell = new Shell();
export const PASSWORD_SYMBOL = '*';
export const HOSTNAME = 'bakalari';
export const BANNER_FOLDER = 'banners';
export const DATA_FOLDER = 'data';
export const CELL_SPACING = 1;
export const COMMANDS: string[] = [
  'help', 'napoveda',
  'hours', 'hodiny',
  'teachers', 'ucitele',
  'timetable', 'rozvrh',
  'changes', 'zmeny',
  'logout', 'odhlasit',
];
export const WEEK_DAYS = [
  'Po',
  'Út',
  'St',
  'Čt',
  'Pá',
];
export const CHANGE_TYPES: {[key in Change['ChangeType']]: string} = {
  'Added': 'Přidáno',
  'Canceled': 'Odebráno',
  'RoomChanged': 'Změna třídy',
  'Substitution': 'Suplování',
};

// Colors
export const C_RED = '\x1b[31m';
export const C_GREEN = '\x1b[32m';
export const C_YELLOW = '\x1b[33m';
export const C_BLUE = '\x1b[34m';
export const C_MAGENTA = '\x1b[35m';
export const C_CYAN = '\x1b[36m';
export const C_END = '\x1b[0m';

const handleLogin = async (): Promise<{
  auth: UserAuth;
  tokenData: APITokenObject;
} | null> => {
  const auth = getAuthFromCache() ?? getAuthFromInput();
  const tokenData = await fetchToken(auth);

  if (!tokenData) {
    console.log('Incorrect login!');
    return null;
  }

  saveAuth(auth);
  shell.setUserName(auth.userName);

  return {
    auth,
    tokenData,
  };
};

(async () => {
  shell.setHostname(HOSTNAME);
  printBanner('welcome', {
    newLine: true,
  });

  const loginData = await handleLogin();
  if (!loginData) return;

  let programRunning = true;
  while (programRunning) {
    const command = shell.getCommand();
    await handleCommand(
      command.keywords,
      command.options,
      loginData.auth,
      loginData.tokenData.access_token,
      () => {
        programRunning = false;
      },
      handleLogin,
    );
  }
})();
