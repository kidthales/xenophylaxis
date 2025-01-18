import { RequiredAssets } from '../bridge/assets';
import ParagraphBuffer from '../dom/paragraph-buffer.class';

enum State {
  ShowTopContainerParagraphs,
  ShowBottomContainerParagraphs,
  Done
}

export default class DemoNarrativeBScene extends Phaser.Scene {
  static readonly Events = {
    CHOICE: 'demonarrativebscenechoice'
  } as const;

  static readonly Choices = {
    START: 1,
    EXIT: 2
  } as const;

  private topContainerParagraphs!: ParagraphBuffer[];
  private bottomContainerParagraphs!: ParagraphBuffer[];

  private topContainerParagraphsIndex!: number;
  private bottomContainerParagraphsIndex!: number;

  private choicesContainer!: HTMLElement;

  private state!: State;

  init() {
    this.topContainerParagraphsIndex = 0;
    this.bottomContainerParagraphsIndex = 0;

    this.topContainerParagraphs = [];
    this.bottomContainerParagraphs = [];

    this.state = State.ShowTopContainerParagraphs;
  }

  create() {
    const sceneHtml = this.add
      .dom(this.cameras.main.centerX, this.cameras.main.centerY)
      .createFromCache(RequiredAssets.DemoNarrativeBSceneHtml);

    sceneHtml.node
      .querySelector('#topContainer')
      ?.querySelectorAll('p')
      .forEach((p) => this.topContainerParagraphs.push(new ParagraphBuffer(p)));

    sceneHtml.node
      .querySelector('#bottomContainer')
      ?.querySelectorAll('p')
      .forEach((p) => this.bottomContainerParagraphs.push(new ParagraphBuffer(p)));

    this.choicesContainer = sceneHtml.node.querySelector('#choicesContainer') as HTMLElement;

    // Hide choices.
    this.choicesContainer.style.opacity = '0';
  }

  update(_: number, delta: number): void {
    switch (this.state) {
      case State.ShowTopContainerParagraphs:
        this.showTopContainerParagraphs(delta);
        break;
      case State.ShowBottomContainerParagraphs:
        this.showBottomContainerParagraphs(delta);
        break;
      case State.Done:
        this.done();
        break;
    }
  }

  private showTopContainerParagraphs(delta: number) {
    if (this.topContainerParagraphsIndex >= this.topContainerParagraphs.length) {
      // Top container paragraphs exhausted, now show the bottom container.
      this.state = State.ShowBottomContainerParagraphs;
      return;
    }

    if (!this.topContainerParagraphs[this.topContainerParagraphsIndex].print(delta)) {
      ++this.topContainerParagraphsIndex;
    }
  }

  private showBottomContainerParagraphs(delta: number) {
    if (this.bottomContainerParagraphsIndex >= this.bottomContainerParagraphs.length) {
      // Bottom container paragraphs exhausted, we are done.
      this.state = State.Done;
      return;
    }

    if (!this.bottomContainerParagraphs[this.bottomContainerParagraphsIndex].print(delta)) {
      ++this.bottomContainerParagraphsIndex;
    }
  }

  private done() {
    if (this.choicesContainer.style.opacity === '1') {
      return;
    }

    this.choicesContainer.style.opacity = '1';

    this.input.keyboard?.once(Phaser.Input.Keyboard.Events.KEY_UP + 'ONE', () =>
      this.events.emit(DemoNarrativeBScene.Events.CHOICE, DemoNarrativeBScene.Choices.START)
    );
    this.input.keyboard?.once(Phaser.Input.Keyboard.Events.KEY_UP + 'TWO', () =>
      this.events.emit(DemoNarrativeBScene.Events.CHOICE, DemoNarrativeBScene.Choices.EXIT)
    );
  }
}
