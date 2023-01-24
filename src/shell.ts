import prompt from 'prompt-sync';

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
    const command = defaultPrompt(`[${this.userName}@${this.hostName}]$ `);
    return command;
  };

  setInputPrompt = (prompt: string) => this.inputPrompt = prompt;
  setUserName = (prompt: string) => this.userName = prompt;
  setHostname = (prompt: string) => this.hostName = prompt;
}
