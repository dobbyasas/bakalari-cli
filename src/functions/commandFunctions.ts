import { printBanner } from './bannerFunctions';

export const handleCommand = (keywords: string[], options: string[]) => {
  if (keywords.length === 0) return;
  switch (keywords[0].toLowerCase()) {
    case 'help':
    case 'napoveda':
      printBanner('help');
      break;

    default:
      console.log(`Neznámý příkaz: ${keywords[0]}`)
      break;
  }
};
