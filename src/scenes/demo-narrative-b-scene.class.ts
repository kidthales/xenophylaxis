import { RequiredAssets, XoninAnimations } from '../bridge/assets';
import normalizeDOMRect from '../dom/normalize-dom-rect.function';
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

  private sceneHtml?: Phaser.GameObjects.DOMElement;

  private topContainerParagraphs: ParagraphBuffer[] = [];
  private bottomContainerParagraphs: ParagraphBuffer[] = [];

  private topContainerParagraphsIndex = 0;
  private bottomContainerParagraphsIndex = 0;

  private choicesContainer?: HTMLElement;

  private state!: State;

  private xoninA?: Phaser.GameObjects.Sprite;
  private xoninB?: Phaser.GameObjects.Sprite;
  private xoninC?: Phaser.GameObjects.Sprite;

  private xoninAAnchor?: HTMLElement;
  private xoninBAnchor?: HTMLElement;
  private xoninCAnchor?: HTMLElement;

  private playTextPrintSfxLastPlay = 0;

  init() {
    this.state = State.ShowTopContainerParagraphs;

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.sceneHtml?.destroy();
      delete this.sceneHtml;

      this.topContainerParagraphs.length = 0;
      this.bottomContainerParagraphs.length = 0;

      this.topContainerParagraphsIndex = 0;
      this.bottomContainerParagraphsIndex = 0;

      delete this.choicesContainer;

      this.xoninA?.destroy();
      delete this.xoninA;

      this.xoninB?.destroy();
      delete this.xoninB;

      this.xoninC?.destroy();
      delete this.xoninC;

      delete this.xoninAAnchor;
      delete this.xoninBAnchor;
      delete this.xoninCAnchor;

      this.input.keyboard?.removeAllListeners();

      this.playTextPrintSfxLastPlay = 0;
    });
  }

  create() {
    this.sceneHtml = this.add
      .dom(this.cameras.main.centerX, this.cameras.main.centerY)
      .createFromCache(RequiredAssets.HtmlDemoNarrativeBScene);

    this.sceneHtml.node
      .querySelector('#topContainer')
      ?.querySelectorAll('p')
      .forEach((p) => {
        const b = new ParagraphBuffer(p);
        b.on(ParagraphBuffer.Events.PRINT, () => this.playTextPrintSfx());
        this.topContainerParagraphs.push(b);
      });

    this.sceneHtml.node
      .querySelector('#bottomContainer')
      ?.querySelectorAll('p')
      .forEach((p) => {
        const b = new ParagraphBuffer(p);
        b.on(ParagraphBuffer.Events.PRINT, () => this.playTextPrintSfx());
        this.bottomContainerParagraphs.push(b);
      });

    this.xoninAAnchor = this.sceneHtml.node.querySelector('#xoninAAnchor') as HTMLElement;
    this.xoninBAnchor = this.sceneHtml.node.querySelector('#xoninBAnchor') as HTMLElement;
    this.xoninCAnchor = this.sceneHtml.node.querySelector('#xoninCAnchor') as HTMLElement;

    this.choicesContainer = this.sceneHtml.node.querySelector('#choicesContainer') as HTMLElement;

    // Hide choices.
    this.choicesContainer.style.opacity = '0';
  }

  update(_: number, delta: number) {
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
    if (!this.xoninA) {
      this.xoninA = this.addXonin(
        (this.xoninAAnchor as HTMLElement).getBoundingClientRect(),
        XoninAnimations.BladeHighRunRight
      );
    }

    if (this.bottomContainerParagraphsIndex >= this.bottomContainerParagraphs.length) {
      // Bottom container paragraphs exhausted, we are done.
      this.state = State.Done;
      return;
    }

    if (!this.bottomContainerParagraphs[this.bottomContainerParagraphsIndex].print(delta)) {
      ++this.bottomContainerParagraphsIndex;

      if (!this.xoninB && this.bottomContainerParagraphsIndex > 0) {
        this.xoninB = this.addXonin(
          (this.xoninBAnchor as HTMLElement).getBoundingClientRect(),
          XoninAnimations.BlasterMidRunLeft
        );
      }

      if (!this.xoninC && this.bottomContainerParagraphsIndex === this.bottomContainerParagraphs.length - 1) {
        this.xoninC = this.addXonin(
          (this.xoninCAnchor as HTMLElement).getBoundingClientRect(),
          XoninAnimations.ThumbsUpRight
        );
      }
    }
  }

  private done() {
    if ((this.choicesContainer as HTMLElement).style.opacity === '1') {
      return;
    }

    (this.choicesContainer as HTMLElement).style.opacity = '1';

    this.input.keyboard?.once(Phaser.Input.Keyboard.Events.KEY_UP + 'ONE', () =>
      this.events.emit(DemoNarrativeBScene.Events.CHOICE, DemoNarrativeBScene.Choices.START)
    );
    this.input.keyboard?.once(Phaser.Input.Keyboard.Events.KEY_UP + 'TWO', () =>
      this.events.emit(DemoNarrativeBScene.Events.CHOICE, DemoNarrativeBScene.Choices.EXIT)
    );
  }

  private addXonin(targetRect: DOMRect, animKey: string) {
    targetRect = normalizeDOMRect(this, targetRect);
    const sceneRect = normalizeDOMRect(
      this,
      (this.sceneHtml as Phaser.GameObjects.DOMElement).node.getBoundingClientRect()
    );

    const xonin = this.add
      .sprite(
        targetRect.left - sceneRect.left + targetRect.width / 2,
        targetRect.top - sceneRect.top + targetRect.height / 2,
        RequiredAssets.AnimsXonin
      )
      .setScale(2)
      .setAlpha(0);

    xonin.anims.createFromAseprite(RequiredAssets.AnimsXonin, [animKey]);

    xonin.play({ key: animKey, repeat: -1 });

    this.add.tween({
      targets: xonin,
      duration: 1000,
      alpha: 1
    });

    this.sound.play(RequiredAssets.SfxShowMap, { volume: 0.5 });

    return xonin;
  }

  private playTextPrintSfx() {
    const now = this.time.now;

    if (now - this.playTextPrintSfxLastPlay > 100) {
      this.sound.play(RequiredAssets.SfxTextPrint, { volume: 0.5 });
      this.playTextPrintSfxLastPlay = now;
    }
  }
}
