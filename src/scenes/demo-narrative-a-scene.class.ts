import { RequiredAssets, StellarNeighborhoodAnimations } from '../bridge/assets';
import normalizeDOMRect from '../dom/normalize-dom-rect.function';
import ParagraphBuffer from '../dom/paragraph-buffer.class';

enum State {
  ShowTopContainerParagraphs,
  ShowMap,
  ShowBottomContainerParagraphs,
  Done
}

export default class DemoNarrativeAScene extends Phaser.Scene {
  static readonly Events = {
    DONE: 'demonarrativeascenedone'
  } as const;

  private sceneHtml?: Phaser.GameObjects.DOMElement;

  private topContainerParagraphs: ParagraphBuffer[] = [];
  private bottomContainerParagraphs: ParagraphBuffer[] = [];

  private topContainerParagraphsIndex = 0;
  private bottomContainerParagraphsIndex = 0;

  private continueContainer?: HTMLElement;

  private state!: State;

  private map?: Phaser.GameObjects.Sprite;
  private mapAnimations: Phaser.Animations.Animation[] = [];
  private mapAnchor?: HTMLElement;

  private playTextPrintSfxLastPlay = 0;

  init() {
    this.state = State.ShowTopContainerParagraphs;

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.sceneHtml?.destroy();
      delete this.sceneHtml;

      this.topContainerParagraphs.forEach((p) => p.destroy());
      this.bottomContainerParagraphs.forEach((p) => p.destroy());

      this.topContainerParagraphs.length = 0;
      this.bottomContainerParagraphs.length = 0;

      this.topContainerParagraphsIndex = 0;
      this.bottomContainerParagraphsIndex = 0;

      delete this.continueContainer;

      this.map?.destroy();
      delete this.map;

      // No animation key collisions when we recreate scene.
      this.mapAnimations?.forEach((a) => this.anims.remove(a.key));
      this.mapAnimations.length = 0;

      delete this.mapAnchor;

      this.playTextPrintSfxLastPlay = 0;
    });
  }

  create() {
    this.sceneHtml = this.add
      .dom(this.cameras.main.centerX, this.cameras.main.centerY)
      .createFromCache(RequiredAssets.HtmlDemoNarrativeAScene);

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

    this.continueContainer = this.sceneHtml.node.querySelector('#continueContainer') as HTMLElement;

    // Hide continue text.
    this.continueContainer.style.opacity = '0';

    // Create the map animations.
    this.mapAnimations.push(...this.anims.createFromAseprite(RequiredAssets.AnimsStellarNeighborhood));

    this.mapAnchor = this.sceneHtml.node.querySelector('#mapAnchor') as HTMLElement;
  }

  update(_: number, delta: number) {
    switch (this.state) {
      case State.ShowTopContainerParagraphs:
        this.showTopContainerParagraphs(delta);
        break;
      case State.ShowMap:
        this.showMap();
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
      // Top container paragraphs exhausted, now show the map.
      this.state = State.ShowMap;

      // Reset last play timestamp so we get sfx immediately when we resume printing.
      this.playTextPrintSfxLastPlay = 0;

      return;
    }

    if (!this.topContainerParagraphs[this.topContainerParagraphsIndex].print(delta)) {
      ++this.topContainerParagraphsIndex;
    }
  }

  private showMap() {
    if (this.map) {
      return;
    }

    const mapRect = normalizeDOMRect(this, (this.mapAnchor as HTMLElement).getBoundingClientRect());
    const sceneRect = normalizeDOMRect(
      this,
      (this.sceneHtml as Phaser.GameObjects.DOMElement).node.getBoundingClientRect()
    );

    this.map = this.add
      .sprite(
        mapRect.left - sceneRect.left + mapRect.width / 2,
        mapRect.top - sceneRect.top + mapRect.height / 2,
        RequiredAssets.AnimsStellarNeighborhood
      )
      .setAlpha(0)
      .play({ key: StellarNeighborhoodAnimations.Start, repeat: -1 });

    const timeline = this.add.timeline([
      // Show map.
      {
        at: 0,
        tween: {
          targets: this.map,
          alpha: 1,
          duration: 1000
        }
      },
      // Play map animations.
      {
        at: 1500,
        run: () =>
          this.map
            ?.play({ key: StellarNeighborhoodAnimations.Peel, repeat: 0 })
            .chain([
              { key: StellarNeighborhoodAnimations.End, repeat: 0 },
              { key: StellarNeighborhoodAnimations.LabelledEnd, repeat: 0 }
            ])
            .once(
              Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + StellarNeighborhoodAnimations.LabelledEnd,
              () => (this.state = State.ShowBottomContainerParagraphs)
            )
      }
    ]);

    timeline.play();
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
    if ((this.continueContainer as HTMLElement).style.opacity === '1') {
      return;
    }

    (this.continueContainer as HTMLElement).style.opacity = '1';

    this.input.keyboard?.once('keyup', () => this.events.emit(DemoNarrativeAScene.Events.DONE));
  }

  private playTextPrintSfx() {
    const now = this.time.now;

    if (now - this.playTextPrintSfxLastPlay > 100) {
      this.sound.play(RequiredAssets.SfxTextPrint, { volume: 0.5 });
      this.playTextPrintSfxLastPlay = now;
    }
  }
}
