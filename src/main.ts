import { Shell } from './shell';
import { printBanner } from './functions/bannerFunctions';
import { getAuthFromCache, getAuthFromInput } from './functions/authFunctions';
import { fetchToken } from './functions/fetchFunctions';
import { saveAuth } from './functions/authFunctions';
import { handleCommand } from './functions/commandFunctions';
import { HOSTNAME, RELEASE_NUMBER } from './constants';

import type { UserAuth } from './typings/authTypes';
import type { APITokenObject } from './typings/apiTypes';

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
