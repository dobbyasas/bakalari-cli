import type { UserAuth } from '../typings/authTypes';

import { shell } from '../main';

export const getAuhFromInput = (): UserAuth => {
  console.log('Enter the URL of Bakaláři')
  const apiEndpoint = shell.getInput();
  console.log('Enter your username')
  const userName = shell.getInput();
  console.log('Enter your password')
  const password = shell.getInput();

  return {
    apiEndpoint,
    userName,
    password,
  };
};
