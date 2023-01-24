import prompt from 'prompt-sync';

const defaultPrompt = prompt({
  sigint: true,
});

export class Shell {
  hostName = '';
  inputPrompt = '> ';

  getInput = (): string => {
    const input = defaultPrompt(this.inputPrompt);
    return input;
  };

  getCommand = (): string => {
    const command = defaultPrompt(`[user@${this.hostName}]$ `);
    return command;
  };

  setInputPrompt = (prompt: string) => this.inputPrompt = prompt;
  setHostname = (prompt: string) => this.hostName = prompt;
}
