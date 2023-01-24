import { Shell } from './shell';
import { printBanner } from './functions/bannerFunctions';
import {
  getAuthFromCache,
  getAuthFromInput
} from './functions/authFunctions';
import { fetchToken } from './functions/fetchFunctions';
import { saveAuth } from './functions/authFunctions';

export const shell = new Shell();
export const HOSTNAME = 'bakalari';
export const BANNER_FOLDER = 'banners';
export const DATA_FOLDER = 'data';

(async () => {
  shell.setHostname(HOSTNAME);
  printBanner('welcome');
  const auth = getAuthFromCache() ?? getAuthFromInput();
  const tokenData = await fetchToken(auth);

  if (!tokenData) {
    console.log('Incorrect login!');
    return;
  }

  saveAuth(auth);
  shell.setUserName(auth.userName);
  shell.getCommand();
})();
