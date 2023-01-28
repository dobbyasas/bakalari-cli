import type { Change } from './typings/timetableTypes';

// Constants
export const PASSWORD_SYMBOL = '*';
export const HOSTNAME = 'bakalari';
export const BANNER_FOLDER = 'banners';
export const DATA_FOLDER = 'data';
export const CELL_SPACING = 1;
export const COLUMN_SPACING = 2;
export const COMMANDS: string[] = [
  'help', 'napoveda',
  'hours', 'hodiny',
  'teachers', 'ucitele',
  'timetable', 'rozvrh',
  'changes', 'zmeny',
  'final', 'pololeti',
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
