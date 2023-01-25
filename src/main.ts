import { Shell } from './shell';
import { printBanner } from './functions/bannerFunctions';
import {
  getAuthFromCache,
  getAuthFromInput
} from './functions/authFunctions';
import { fetchToken } from './functions/fetchFunctions';
import { saveAuth } from './functions/authFunctions';
import { handleCommand } from './functions/commandFunctions';

// Constants
export const shell = new Shell();
export const HOSTNAME = 'bakalari';
export const BANNER_FOLDER = 'banners';
export const DATA_FOLDER = 'data';
export const CELL_SPACING = 1;
export const WEEK_DAYS = [
  'Po',
  'Út',
  'St',
  'Čt',
  'Pá',
];

// Colors
export const C_RED = '\x1b[31m';
export const C_GREEN = '\x1b[32m';
export const C_YELLOW = '\x1b[33m';
export const C_BLUE = '\x1b[34m';
export const C_MAGENTA = '\x1b[35m';
export const C_CYAN = '\x1b[36m';
export const C_END = '\x1b[0m';

(async () => {
  shell.setHostname(HOSTNAME);
  printBanner('welcome', {
    newLine: true,
  });

  const auth = getAuthFromCache() ?? getAuthFromInput();
  const tokenData = await fetchToken(auth);

  if (!tokenData) {
    console.log('Incorrect login!');
    return;
  }

  saveAuth(auth);
  shell.setUserName(auth.userName);

  let programRunning = true;
  while (programRunning) {
    const command = shell.getCommand();
    if (command.keywords[0].toLowerCase() === 'exit') {
      programRunning = false;
      break;
    }
    await handleCommand(command.keywords, command.options, auth, tokenData.access_token);
  }
})();
