import fs from 'fs';

import { BANNER_FOLDER } from '../constants.js';

export const printBanner = (
  banner: string,
  options?: {
    newLine?: boolean;
    placeholders?: { [key: string]: string };
    displayError?: boolean;
  }
): boolean => {
  try {
    if (!fs.existsSync(`${BANNER_FOLDER}/${banner}.txt`)) {
      if (options ? options.displayError : true)
        console.log(`Banner ${banner} does not exist!`);
      if (options?.newLine) console.log('');
      return false;
    }
    const bannerFile = fs.readFileSync(`${BANNER_FOLDER}/${banner}.txt`);
    let bannerText = bannerFile.toString().trimEnd();
    if (options?.placeholders) {
      const regex = new RegExp(
        Object.keys(options.placeholders)
          .map((option) => `{${option}}`)
          .join('|'),
        'gi'
      );
      const placeholders = options.placeholders;
      bannerText = bannerText.replace(
        regex,
        (matched) => placeholders[matched.replace(/[{}]/g, '')]
      );
    }
    console.log(bannerText);
    if (options?.newLine) console.log('');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
