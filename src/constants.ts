import type { Change } from './typings/timetableTypes.js';

// Release Constants
export const RELEASE_NUMBER = '1.0.4';
export const RELEASE_PLACEHOLDER = '{release}';
export const RELEASE_WIP = true;

// Texts
export const LOGGING_IN_TEXT = 'Probíhá přihlašování';
export const LOADING_DATA_TEXT = 'Načítání data';

// Constants
export const PASSWORD_KEY = 'qLGT7kpULFOc';
export const PASSWORD_SYMBOL = '*';
export const HOSTNAME = 'bakalari';
export const BANNER_FOLDER = 'banners';
export const DATA_FOLDER = 'data';
export const CELL_SPACING = 1;
export const COLUMN_SPACING = 2;
export const EN_COMMANDS: string[] = [
  'help',
  'hours',
  'teachers',
  'subjects',
  'timetable',
  'marks',
  'changes',
  'final',
  'absence',
  'bfetch',
  'clear',
  'logout',
];
export const CZ_COMMANDS: string[] = [
  'napoveda',
  'hodiny',
  'ucitele',
  'predmety',
  'rozvrh',
  'znamky',
  'zmeny',
  'pololeti',
  'absence',
  'bfetch',
  'cls',
  'odhlasit',
];
export const COMMAND_LOOKUP_TABLE = {
  napoveda: 'help',
  hodiny: 'hours',
  ucitele: 'teachers',
  predmety: 'subjects',
  rozvrh: 'timetable',
  znamky: 'marks',
  zmeny: 'changes',
  pololeti: 'final',
  odhlasit: 'logout',
  cls: 'clear',
};
export const WEEK_DAYS = ['Po', 'Út', 'St', 'Čt', 'Pá'];
export const CHANGE_TYPES: { [key in Change['ChangeType']]: string } = {
  Added: 'Přidáno',
  Canceled: 'Zrušeno',
  Removed: 'Odebráno',
  RoomChanged: 'Změna třídy',
  Substitution: 'Suplování',
};

// Colors
export const C_BLACK = '\x1b[30m';
export const C_RED = '\x1b[31m';
export const C_GREEN = '\x1b[32m';
export const C_YELLOW = '\x1b[33m';
export const C_BLUE = '\x1b[34m';
export const C_MAGENTA = '\x1b[35m';
export const C_CYAN = '\x1b[36m';
export const C_END = '\x1b[0m';

// Background colors
export const BG_WHITE = '\x1b[47m';

// Extra
export const APP_LOGO = [
  `${C_BLUE}██████████████████${C_END}`,
  `${C_BLUE}██████${C_END}██████${C_BLUE}██████${C_END}`,
  `${C_BLUE}██${C_END}████${C_BLUE}██████${C_END}████${C_BLUE}██${C_END}`,
  `${C_BLUE}██${C_END}██${C_BLUE}██████████${C_END}██${C_BLUE}██${C_END}`,
  `${C_BLUE}██${C_END}██${C_BLUE}████${C_END}██████${C_BLUE}████${C_END}`,
  `${C_BLUE}██${C_END}██${C_BLUE}██████████${C_END}██${C_BLUE}██${C_END}`,
  `${C_BLUE}██${C_END}████${C_BLUE}██████${C_END}████${C_BLUE}██${C_END}`,
  `${C_BLUE}██████${C_END}██████${C_BLUE}██████${C_END}`,
  `${C_BLUE}██████████████████${C_END}`,
];
