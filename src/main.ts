import { Shell } from './shell';
import { getAuhFromInput } from './functions/authFunctions';

export const shell = new Shell();
export const HOSTNAME = 'bakalari';

shell.setHostname(HOSTNAME);
const auth = getAuhFromInput();
console.log(auth);
