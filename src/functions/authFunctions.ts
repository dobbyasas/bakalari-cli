import type { UserAuth } from '../typings/authTypes';

import { shell } from '../main';

export const getAuthFromInput = (): UserAuth => {
  console.log('Enter the URL of Bakaláři')
  const apiEndpoint = shell.getInput();
  console.log('Enter your username')
  const userName = shell.getInput();
  console.log('Enter your password')
  const password = shell.getInput();
  console.log('');

  return {
    apiEndpoint,
    userName,
    password,
  };
};
