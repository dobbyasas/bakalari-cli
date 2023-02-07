import fs from 'fs';
import CryptoJS from 'crypto-js';

import { shell } from '../main.js';
import { DATA_FOLDER, PASSWORD_KEY } from '../constants.js';

import type { UserAuth } from '../typings/authTypes.js';

export const getAuthFromInput = (): UserAuth => {
  console.log('Enter the URL of Bakaláři');
  const apiEndpoint = shell.getInput();
  console.log('Enter your username');
  const userName = shell.getInput();
  console.log('Enter your password');
  const password = shell.getPassword();
  console.log('');

  return {
    apiEndpoint,
    userName,
    password,
  };
};

export const getAuthFromCache = (): UserAuth | null => {
  if (!fs.existsSync(`${DATA_FOLDER}/auth.json`)) return null;
  const authData = fs.readFileSync(`${DATA_FOLDER}/auth.json`);
  const auth = JSON.parse(authData.toString());

  return {
    ...auth,
    password: CryptoJS.AES.decrypt(auth.password, PASSWORD_KEY).toString(
      CryptoJS.enc.Utf8
    ),
  };
};

const createAuthFolder = () => {
  if (!fs.existsSync(DATA_FOLDER)) {
    fs.mkdirSync(DATA_FOLDER);
  }
};

export const saveAuth = (auth: UserAuth) => {
  createAuthFolder();
  fs.writeFileSync(
    `${DATA_FOLDER}/auth.json`,
    JSON.stringify(
      {
        ...auth,
        password: CryptoJS.AES.encrypt(auth.password, PASSWORD_KEY).toString(),
      },
      null,
      2
    )
  );
};

export const deleteAuth = () => {
  if (fs.existsSync(`${DATA_FOLDER}/auth.json`)) {
    fs.rmSync(`${DATA_FOLDER}/auth.json`);
  }
};
