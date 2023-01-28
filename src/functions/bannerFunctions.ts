import * as fs from 'fs';

import { BANNER_FOLDER } from '../constants';

export const printBanner = (banner: string, options?: {
  newLine?: boolean,
}) => {
  try {
    if (!fs.existsSync(`${BANNER_FOLDER}/${banner}.txt`)) {
      console.log(`Banner ${banner} does not exist!`);
      if (options?.newLine) console.log('');
      return;
    }
    const bannerFile = fs.readFileSync(`${BANNER_FOLDER}/${banner}.txt`);
    console.log(bannerFile.toString().trimEnd());
    if (options?.newLine) console.log('');
  } catch (error) {
    console.log(error);
  }
};
