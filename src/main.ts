import { Shell } from './shell';

export const shell = new Shell();
export const HOSTNAME = 'bakalari';

shell.setHostname(HOSTNAME);

while (true) {
  shell.getInput();
  shell.getCommand();
}
