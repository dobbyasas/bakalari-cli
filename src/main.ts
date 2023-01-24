import { Shell } from './shell';
import { printBanner } from './functions/bannerFunctions';
import { getAuthFromInput } from './functions/authFunctions';
import { fetchToken } from './functions/fetchFunctions';

export const shell = new Shell();
export const HOSTNAME = 'bakalari';
export const BANNER_FOLDER = 'banners';

(async () => {
  shell.setHostname(HOSTNAME);
  printBanner('welcome');
  const auth = getAuthFromInput();
  const tokenData = await fetchToken(auth);

  if (!tokenData) {
    console.log('Incorrect login!');
    return;
  }

  shell.setUserName(auth.userName);
  shell.getCommand();
})();
