export default class {
  private readonly buffer: string;
  private index = 0;
  private accumulator = 0;

  constructor(
    private readonly element: HTMLParagraphElement,
    private readonly cps = 60
  ) {
    this.buffer = element.textContent || '';
    element.textContent = '';
  }

  print(delta: number) {
    if (this.index >= this.buffer.length) {
      return 0;
    }

    this.accumulator += this.cps * (delta / 1000);

    const length = Math.floor(this.accumulator);
    this.accumulator -= length;

    for (let i = 0; i < length; ++i) {
      this.element.textContent += this.buffer[this.index++];

      if (this.index >= this.buffer.length) {
        return 0;
      }
    }

    return this.buffer.length - this.index;
  }
}
