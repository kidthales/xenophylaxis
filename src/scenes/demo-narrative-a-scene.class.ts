import { RequiredAssets, StellarNeighborhoodAnimations } from '../bridge/assets';
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

  private topContainerParagraphs!: ParagraphBuffer[];
  private bottomContainerParagraphs!: ParagraphBuffer[];

  private topContainerParagraphsIndex!: number;
  private bottomContainerParagraphsIndex!: number;

  private continueContainer!: HTMLElement;

  private state!: State;

  private map?: Phaser.GameObjects.Sprite;
  private mapAnimations?: Phaser.Animations.Animation[];

  init() {
    this.topContainerParagraphsIndex = 0;
    this.bottomContainerParagraphsIndex = 0;

    this.topContainerParagraphs = [];
    this.bottomContainerParagraphs = [];

    this.state = State.ShowTopContainerParagraphs;

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
      .querySelector('#topContainer')
      ?.querySelectorAll('p')
      .forEach((p) => this.topContainerParagraphs.push(new ParagraphBuffer(p)));

    sceneHtml.node
      .querySelector('#bottomContainer')
      ?.querySelectorAll('p')
      .forEach((p) => this.bottomContainerParagraphs.push(new ParagraphBuffer(p)));

    this.continueContainer = sceneHtml.node.querySelector('#continueContainer') as HTMLElement;

    // Hide continue text.
    this.continueContainer.style.opacity = '0';

    // Create the map animations.
    this.mapAnimations = this.anims.createFromAseprite(RequiredAssets.StellarNeighborhoodAseprite);
  }

  update(_: number, delta: number): void {
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
    if (this.continueContainer.style.opacity === '1') {
      return;
    }

    this.continueContainer.style.opacity = '1';

    this.input.keyboard?.once('keyup', () => this.events.emit(DemoNarrativeAScene.Events.DONE));
  }
}
