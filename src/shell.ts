import prompt from 'prompt-sync';

import { C_GREEN, C_CYAN, C_END } from './main';

const defaultPrompt = prompt({
  sigint: true,
});

export class Shell {
  userName = 'user';
  hostName = '';
  inputPrompt = '> ';

  getInput = (): string => {
    const input = defaultPrompt(this.inputPrompt);
    return input;
  };

  getCommand = (): string => {
    const command = defaultPrompt(`[${C_GREEN}${this.userName}${C_END}@${C_CYAN}${this.hostName}${C_END}]$ `);
    return command;
  };

  setInputPrompt = (prompt: string) => this.inputPrompt = prompt;
  setUserName = (prompt: string) => this.userName = prompt;
  setHostname = (prompt: string) => this.hostName = prompt;
}
