import prompt from 'prompt-sync';
import promptHistory from 'prompt-sync-history';
import ora from 'ora';
import cliSpinners from 'cli-spinners';

import {
  EN_COMMANDS,
  CZ_COMMANDS,
  PASSWORD_SYMBOL,
  C_GREEN,
  C_CYAN,
  C_END,
} from './constants.js';

const defaultPrompt = prompt({
  sigint: true,
  history: promptHistory(),
  autocomplete: () => [...EN_COMMANDS, ...CZ_COMMANDS],
});

export class Shell {
  userName = 'user';
  hostName = 'host';
  inputPrompt = '> ';
  spinner = ora({
    spinner: cliSpinners.dots,
    discardStdin: true,
  });

  getInput = (): string => {
    const input = defaultPrompt(this.inputPrompt);
    return input;
  };

  getPassword = (): string => {
    const input = defaultPrompt(this.inputPrompt, {
      echo: PASSWORD_SYMBOL,
    });
    return input;
  };

  getCommand = (): {
    keywords: string[];
    options: string[];
  } => {
    const command = defaultPrompt(
      `[${C_GREEN}${this.userName}${C_END}@${C_CYAN}${this.hostName}${C_END}]$ `
    );
    const commandString = command.replace(/\s+/g, ' ');
    const commandItems = commandString.split(' ');

    const keywords: string[] = [];
    const options: string[] = [];

    commandItems.forEach((item) => {
      item.startsWith('-')
        ? options.push(...item.replace('-', '').split(''))
        : keywords.push(item);
    });

    return {
      keywords,
      options,
    };
  };

  setInputPrompt = (prompt: string) => (this.inputPrompt = prompt);
  setUserName = (prompt: string) => (this.userName = prompt);
  setHostname = (prompt: string) => (this.hostName = prompt);
}
