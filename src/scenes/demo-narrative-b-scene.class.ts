import { RequiredAssets } from '../bridge/assets';
import ParagraphBuffer from '../dom/paragraph-buffer.class';

enum State {
  ShowTopPanel,
  ShowMiddlePanel,
  ShowBottomPanel,
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

  private topPanelParagraphs!: ParagraphBuffer[];
  private middlePanelParagraphs!: ParagraphBuffer[];
  private bottomPanelParagraphs!: ParagraphBuffer[];

  private topPanelParagraphsIndex!: number;
  private middlePanelParagraphsIndex!: number;
  private bottomPanelParagraphsIndex!: number;

  private menuContainer!: HTMLDivElement;

  private state!: State;

  init() {
    this.topPanelParagraphsIndex = 0;
    this.middlePanelParagraphsIndex = 0;
    this.bottomPanelParagraphsIndex = 0;

    this.topPanelParagraphs = [];
    this.middlePanelParagraphs = [];
    this.bottomPanelParagraphs = [];

    this.state = State.ShowTopPanel;
  }

  create() {
    const sceneHtml = this.add
      .dom(this.cameras.main.centerX, this.cameras.main.centerY)
      .createFromCache(RequiredAssets.DemoNarrativeBSceneHtml);

    sceneHtml.node
      .querySelector('.top-panel')
      ?.querySelectorAll('p')
      .forEach((p) => this.topPanelParagraphs.push(new ParagraphBuffer(p)));

    sceneHtml.node
      .querySelector('.middle-panel')
      ?.querySelectorAll('p')
      .forEach((p) => this.middlePanelParagraphs.push(new ParagraphBuffer(p)));

    sceneHtml.node
      .querySelector('.bottom-panel')
      ?.querySelectorAll('p')
      .forEach((p) => this.bottomPanelParagraphs.push(new ParagraphBuffer(p)));

    this.menuContainer = sceneHtml.node.querySelector('.menu-container') as HTMLDivElement;

    // Hide choices menu.
    this.menuContainer.style.opacity = '0';
  }

  update(_: number, delta: number): void {
    switch (this.state) {
      case State.ShowTopPanel:
        this.showTopPanel(delta);
        break;
      case State.ShowMiddlePanel:
        this.showMiddlePanel(delta);
        break;
      case State.ShowBottomPanel:
        this.showBottomPanel(delta);
        break;
      case State.Done:
        this.done();
        break;
    }
  }

  private showTopPanel(delta: number) {
    if (this.topPanelParagraphsIndex >= this.topPanelParagraphs.length) {
      // Top panel paragraphs exhausted, now show the middle panel.
      this.state = State.ShowMiddlePanel;
      return;
    }

    if (!this.topPanelParagraphs[this.topPanelParagraphsIndex].print(delta)) {
      ++this.topPanelParagraphsIndex;
    }
  }

  private showMiddlePanel(delta: number) {
    if (this.middlePanelParagraphsIndex >= this.middlePanelParagraphs.length) {
      // Middle panel paragraphs exhausted, now show the bottom panel.
      this.state = State.ShowBottomPanel;
      return;
    }

    if (!this.middlePanelParagraphs[this.middlePanelParagraphsIndex].print(delta)) {
      ++this.middlePanelParagraphsIndex;
    }
  }

  private showBottomPanel(delta: number) {
    if (this.bottomPanelParagraphsIndex >= this.bottomPanelParagraphs.length) {
      // Bottom panel paragraphs exhausted, we are done.
      this.state = State.Done;
      return;
    }

    if (!this.bottomPanelParagraphs[this.bottomPanelParagraphsIndex].print(delta)) {
      ++this.bottomPanelParagraphsIndex;
    }
  }

  private done() {
    if (this.menuContainer.style.opacity === '1') {
      return;
    }

    this.menuContainer.style.opacity = '1';

    this.input.keyboard?.once(Phaser.Input.Keyboard.Events.KEY_UP + 'ONE', () =>
      this.events.emit(DemoNarrativeBScene.Events.CHOICE, DemoNarrativeBScene.Choices.START)
    );
    this.input.keyboard?.once(Phaser.Input.Keyboard.Events.KEY_UP + 'TWO', () =>
      this.events.emit(DemoNarrativeBScene.Events.CHOICE, DemoNarrativeBScene.Choices.EXIT)
    );
  }
}
