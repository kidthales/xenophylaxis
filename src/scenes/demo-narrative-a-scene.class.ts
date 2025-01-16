import { RequiredAssets, StellarNeighborhoodAnimations } from '../bridge/assets';
import ParagraphBuffer from '../dom/paragraph-buffer.class';

enum State {
  ShowTopPanel,
  ShowMap,
  ShowBottomPanel,
  Done
}

export default class DemoNarrativeAScene extends Phaser.Scene {
  static readonly Events = {
    DONE: 'demonarrativeascenedone'
  } as const;

  private topPanelParagraphs!: ParagraphBuffer[];
  private bottomPanelParagraphs!: ParagraphBuffer[];

  private topPanelParagraphsIndex!: number;
  private bottomPanelParagraphsIndex!: number;

  private continueParagraph!: HTMLParagraphElement;

  private state!: State;

  private map?: Phaser.GameObjects.Sprite;
  private mapAnimations?: Phaser.Animations.Animation[];

  init() {
    this.topPanelParagraphsIndex = 0;
    this.bottomPanelParagraphsIndex = 0;

    this.topPanelParagraphs = [];
    this.bottomPanelParagraphs = [];

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

    sceneHtml.node
      .querySelector('.top-panel')
      ?.querySelectorAll('p')
      .forEach((p) => this.topPanelParagraphs.push(new ParagraphBuffer(p)));

    sceneHtml.node
      .querySelector('.bottom-panel')
      ?.querySelectorAll('p')
      .forEach((p) => this.bottomPanelParagraphs.push(new ParagraphBuffer(p)));

    this.continueParagraph = sceneHtml.node
      .querySelector('.continue-container')
      ?.querySelector('p') as HTMLParagraphElement;

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
    if (this.topPanelParagraphsIndex >= this.topPanelParagraphs.length) {
      // Top panel paragraphs exhausted, now show the map.
      this.state = State.ShowMap;
      return;
    }

    if (!this.topPanelParagraphs[this.topPanelParagraphsIndex].print(delta)) {
      ++this.topPanelParagraphsIndex;
    }
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
    if (this.continueParagraph.style.opacity === '1') {
      return;
    }

    this.continueParagraph.style.opacity = '1';

    this.input.keyboard?.once('keyup', () => this.events.emit(DemoNarrativeAScene.Events.DONE));
  }
}
