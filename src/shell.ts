import prompt from 'prompt-sync';

const defaultPrompt = prompt({
  sigint: true,
});

export class Shell {
  inputPrompt = '> ';  

  getInput = (): string => {
    const input = defaultPrompt(this.inputPrompt);
    return input;
  };
}
