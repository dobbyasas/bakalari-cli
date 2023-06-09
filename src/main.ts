import { Shell } from './shell.js';
import { printBanner } from './functions/bannerFunctions.js';
import {
  getAuthFromCache,
  getAuthFromInput,
} from './functions/authFunctions.js';
import { fetchToken } from './functions/fetchFunctions.js';
import { saveAuth } from './functions/authFunctions.js';
import { handleCommand } from './functions/commandFunctions.js';
import {
  HOSTNAME,
  RELEASE_NUMBER,
  RELEASE_WIP,
  LOGGING_IN_TEXT,
  LOADING_DATA_TEXT,
  C_YELLOW,
  C_END,
} from './constants.js';

import type { UserAuth } from './typings/authTypes.js';
import type { APITokenObject } from './typings/apiTypes.js';

export const shell = new Shell();

const handleLogin = async (): Promise<{
  auth: UserAuth;
  tokenData: APITokenObject;
} | null> => {
  const auth = getAuthFromCache() ?? getAuthFromInput();
  shell.spinner.start(LOGGING_IN_TEXT);
  const tokenData = await fetchToken(auth);
  shell.spinner.stop();

  if (!tokenData) {
    console.log('bro špatnej kogin');
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
  console.clear();
  shell.setHostname(HOSTNAME);
  printBanner('welcome', {
    newLine: true,
    placeholders: {
      release: RELEASE_NUMBER,
      wip: RELEASE_WIP ? ' [WIP]' : '',
    },
  });

  if (RELEASE_WIP) {
    console.log(
      `${C_YELLOW}macatý penis.${C_END}\n`
    );
  }

  const loginData = await handleLogin();
  if (!loginData) return;

  let programRunning = true;
  while (programRunning) {
    const command = shell.getCommand();
    shell.spinner.start(LOADING_DATA_TEXT);
    await handleCommand(
      command.keywords,
      command.options,
      loginData.auth,
      loginData.tokenData.access_token,
      () => {
        programRunning = false;
      },
      handleLogin,
      () => {
        shell.spinner.stop();
      }
    );
  }
})();
