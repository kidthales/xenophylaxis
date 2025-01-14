import { RequiredAssets, StellarNeighborhoodAnimations } from '../bridge/assets';

enum State {
  ShowTopPanel,
  ShowMap,
  ShowBottomPanel,
  Done
}

const printDelay = 32;

export default class DemoNarrativeAScene extends Phaser.Scene {
  static readonly Events = {
    DONE: 'demonarrativescenedone'
  };

  private topPanelTextsIndex!: number;
  private bottomPanelTextsIndex!: number;
  private textIndex!: number;

  private topPanelParagraphs!: NodeListOf<HTMLParagraphElement>;
  private bottomPanelParagraphs!: NodeListOf<HTMLParagraphElement>;
  private continueParagraph!: HTMLParagraphElement;

  private topPanelTexts!: string[];
  private bottomPanelTexts!: string[];

  private printDelayAccumulator!: number;

  private state!: State;

  private map?: Phaser.GameObjects.Sprite;
  private mapAnimations?: Phaser.Animations.Animation[];

  init() {
    this.topPanelTextsIndex = 0;
    this.bottomPanelTextsIndex = 0;
    this.textIndex = 0;

    this.topPanelTexts = [];
    this.bottomPanelTexts = [];

    this.printDelayAccumulator = 0;

    this.state = State.ShowTopPanel;

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      delete this.map;

      // No animation key collisions when we recreate scene.
      this.mapAnimations?.forEach((a) => this.anims.remove(a.key));
      delete this.mapAnimations;
    });
  }

  create() {
    const sceneHtml = this.add
      .dom(this.cameras.main.centerX, this.cameras.main.centerY)
      .createFromCache(RequiredAssets.DemoNarrativeASceneHtml);

    this.topPanelParagraphs = sceneHtml.node
      .querySelector('.top-panel')
      ?.querySelectorAll('p') as NodeListOf<HTMLParagraphElement>;
    this.bottomPanelParagraphs = sceneHtml.node
      .querySelector('.bottom-panel')
      ?.querySelectorAll('p') as NodeListOf<HTMLParagraphElement>;
    this.continueParagraph = sceneHtml.node
      .querySelector('.continue-container')
      ?.querySelector('p') as HTMLParagraphElement;

    // Remove paragraph texts; to be added back in with effects.
    this.topPanelParagraphs.forEach((p) => {
      this.topPanelTexts.push(p.innerText);
      p.innerText = '';
    });
    this.bottomPanelParagraphs.forEach((p) => {
      this.bottomPanelTexts.push(p.innerText);
      p.innerText = '';
    });

    // Hide continue text.
    this.continueParagraph.style.opacity = '0';

    // Create the map animations.
    this.mapAnimations = this.anims.createFromAseprite(RequiredAssets.StellarNeighborhoodAseprite);
  }

  update(_: number, delta: number): void {
    switch (this.state) {
      case State.ShowTopPanel:
        this.showTopPanel(delta);
        break;
      case State.ShowMap:
        this.showMap();
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
    if (this.topPanelTextsIndex >= this.topPanelTexts.length) {
      // Top panel texts exhausted, now show the map.
      this.printDelayAccumulator = 0;
      this.state = State.ShowMap;
      return;
    }

    this.printDelayAccumulator += delta;

    if (this.textIndex >= this.topPanelTexts[this.topPanelTextsIndex].length) {
      // End of current text.
      ++this.topPanelTextsIndex;
      this.textIndex = 0;
      return;
    }

    if (this.printDelayAccumulator < printDelay) {
      return;
    }

    this.printDelayAccumulator = 0;

    this.topPanelParagraphs.item(this.topPanelTextsIndex).textContent +=
      this.topPanelTexts[this.topPanelTextsIndex][this.textIndex++];
  }

  private showMap() {
    if (this.map) {
      return;
    }

    this.map = this.add
      .sprite(this.cameras.main.centerX, this.cameras.main.getBounds().top, RequiredAssets.StellarNeighborhoodAseprite)
      .setOrigin(0)
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
              () => (this.state = State.ShowBottomPanel)
            )
      }
    ]);

    timeline.play();
  }

  private showBottomPanel(delta: number) {
    if (this.bottomPanelTextsIndex >= this.bottomPanelTexts.length) {
      // Bottom panel texts exhausted, we are done.
      this.state = State.Done;
      return;
    }

    this.printDelayAccumulator += delta;

    if (this.textIndex >= this.bottomPanelTexts[this.bottomPanelTextsIndex].length) {
      // End of current text.
      ++this.bottomPanelTextsIndex;
      this.textIndex = 0;
      return;
    }

    if (this.printDelayAccumulator < printDelay) {
      return;
    }

    this.printDelayAccumulator = 0;

    this.bottomPanelParagraphs.item(this.bottomPanelTextsIndex).textContent +=
      this.bottomPanelTexts[this.bottomPanelTextsIndex][this.textIndex++];
  }

  private done() {
    if (this.continueParagraph.style.opacity === '1') {
      return;
    }

    this.continueParagraph.style.opacity = '1';

    this.input.keyboard?.once('keyup', () => this.events.emit(DemoNarrativeAScene.Events.DONE));
  }
}
