import { Shell } from './shell.js';
import { printBanner } from './functions/bannerFunctions.js';
import {
  getAuthFromCache,
  getAuthFromInput,
} from './functions/authFunctions.js';
import { fetchToken } from './functions/fetchFunctions.js';
import { saveAuth } from './functions/authFunctions.js';
import { handleCommand } from './functions/commandFunctions.js';
import { HOSTNAME, RELEASE_NUMBER } from './constants.js';

import type { UserAuth } from './typings/authTypes.js';
import type { APITokenObject } from './typings/apiTypes.js';

export const shell = new Shell();

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
  console.clear();
  shell.setHostname(HOSTNAME);
  printBanner('welcome', {
    newLine: true,
    placeholders: {
      release: RELEASE_NUMBER,
    },
  });

  shell.spinnerTest();

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
      handleLogin
    );
  }
})();
