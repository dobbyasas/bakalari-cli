import { Shell } from './shell';
import { printBanner } from './functions/bannerFunctions';
import { getAuhFromInput } from './functions/authFunctions';

export const shell = new Shell();
export const HOSTNAME = 'bakalari';
export const BANNER_FOLDER = 'banners';

shell.setHostname(HOSTNAME);
printBanner('welcome');
const auth = getAuhFromInput();
console.log(auth);
