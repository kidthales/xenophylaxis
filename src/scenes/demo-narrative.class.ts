import { RequiredAssets } from '../bridge/assets';

type State = 'showTopPanelTexts' | 'showMap' | 'showBottomPanelTexts' | 'done';

// TODO: fix state when we show scene more than once...
export default class extends Phaser.Scene {
  private topPanelTextsIndex = 0;
  private bottomPanelTextsIndex = 0;
  private textIndex = 0;

  private topPanelParagraphs!: NodeListOf<HTMLParagraphElement>;
  private bottomPanelParagraphs!: NodeListOf<HTMLParagraphElement>;
  private continueParagraph!: HTMLParagraphElement;

  private topPanelTexts: string[] = [];
  private bottomPanelTexts: string[] = [];

  private printDelayAccumulator = 0;

  private state: State = 'showTopPanelTexts';

  private map?: Phaser.GameObjects.Sprite;

  create() {
    const sceneHtml = this.add
      .dom(this.cameras.main.centerX, this.cameras.main.centerY)
      .createFromCache(RequiredAssets.DemoNarrativeSceneHtml);

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
    this.anims.createFromAseprite(RequiredAssets.StellarNeighborhoodAseprite);
  }

  update(_: number, delta: number): void {
    switch (this.state) {
      case 'showTopPanelTexts':
        this.showTopPanelTexts(delta);
        break;
      case 'showMap':
        this.showMap();
        break;
      case 'showBottomPanelTexts':
        this.showBottomPanelTexts(delta);
        break;
      case 'done':
        this.done();
        break;
    }
  }

  private showTopPanelTexts(delta: number) {
    if (this.topPanelTextsIndex >= this.topPanelTexts.length) {
      // Top panel texts exhausted, now show the map.
      this.printDelayAccumulator = 0;
      this.state = 'showMap';
      return;
    }

    this.printDelayAccumulator += delta;

    if (this.textIndex >= this.topPanelTexts[this.topPanelTextsIndex].length) {
      // End of current text.
      ++this.topPanelTextsIndex;
      this.textIndex = 0;
      return;
    }

    if (this.printDelayAccumulator < 32) {
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
      .sprite(320, 0, RequiredAssets.StellarNeighborhoodAseprite)
      .setOrigin(0)
      .setAlpha(0)
      .play({ key: 'stellar-neighborhood Start', repeat: -1 });

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
            ?.play({ key: 'stellar-neighborhood Peel', repeat: 0 })
            .chain([
              { key: 'stellar-neighborhood End', repeat: 0 },
              { key: 'stellar-neighborhood Labelled End', repeat: 0 }
            ])
            .once('animationcomplete-stellar-neighborhood Labelled End', () => (this.state = 'showBottomPanelTexts'))
      }
    ]);

    timeline.play();
  }

  private showBottomPanelTexts(delta: number) {
    if (this.bottomPanelTextsIndex >= this.bottomPanelTexts.length) {
      // Bottom panel texts exhausted, we are done.
      this.state = 'done';
      return;
    }

    this.printDelayAccumulator += delta;

    if (this.textIndex >= this.bottomPanelTexts[this.bottomPanelTextsIndex].length) {
      // End of current text.
      ++this.bottomPanelTextsIndex;
      this.textIndex = 0;
      return;
    }

    if (this.printDelayAccumulator < 32) {
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

    this.input.keyboard?.once('keyup', () => this.events.emit('demonarrativescenedone'));
  }
}
