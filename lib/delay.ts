export class Delay {
  #counter: NodeJS.Timeout | number = 0;
  #is_loading: boolean = false;
  constructor(public timeout: number) {}
  get isLoading(): boolean {
    return this.#is_loading;
  }
  on(): Promise<void> {
    this.off();
    this.#is_loading = true;
    return new Promise((rs) => {
      this.#counter = setTimeout(() => {
        rs();
        this.off();
      }, this.timeout);
    });
  }
  off() {
    if (this.#is_loading) {
      clearTimeout(this.#counter);
      this.#is_loading = false;
    }
  }
}
