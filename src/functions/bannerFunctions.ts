import * as fs from 'fs';

import { BANNER_FOLDER } from '../main';

export const printBanner = (banner: string, newLine = true) => {
  try {
    if (!fs.existsSync(`${BANNER_FOLDER}/${banner}.txt`)) {
      console.log(`Banner ${banner} does not exist!`);
      if (newLine) console.log('');
      return;
    }
    const bannerFile = fs.readFileSync(`${BANNER_FOLDER}/${banner}.txt`);
    console.log(bannerFile.toString().trimEnd());
    if (newLine) console.log('');
  } catch (error) {
    console.log(error);
  }
};
