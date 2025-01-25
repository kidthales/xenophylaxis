import { RequiredAssets } from '../bridge/assets';

export default class TitleScene extends Phaser.Scene {
  static readonly Events = {
    CHOICE: 'titlescenechoice'
  } as const;

  static readonly Choices = {
    START: 1,
    CREDITS: 2,
    EXIT: 3
  } as const;

  private sceneHtml?: Phaser.GameObjects.DOMElement;

  private headingContainer?: HTMLElement;
  private choicesContainer?: HTMLElement;
  private versionContainer?: HTMLElement;

  private createCount = 0;

  private starfield?: Phaser.GameObjects.TileSprite;
  private planet?: Phaser.GameObjects.Image;

  private starfieldAccumulator = 0;

  init() {
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.sceneHtml?.destroy();
      delete this.sceneHtml;

      delete this.headingContainer;
      delete this.choicesContainer;
      delete this.versionContainer;

      this.input.keyboard?.removeAllListeners();

      this.starfield?.destroy();
      delete this.starfield;

      this.planet?.destroy();
      delete this.planet;

      this.starfieldAccumulator = 0;
    });
  }

  create() {
    ++this.createCount;

    this.sceneHtml = this.add
      .dom(this.cameras.main.centerX, this.cameras.main.centerY)
      .createFromCache(RequiredAssets.HtmlTitleScene);

    this.headingContainer = this.sceneHtml.node.querySelector('#headingContainer') as HTMLElement;
    this.choicesContainer = this.sceneHtml.node.querySelector('#choicesContainer') as HTMLElement;
    this.versionContainer = this.sceneHtml.node.querySelector('#versionContainer') as HTMLElement;

    // Hide the elements.
    this.headingContainer.style.opacity = '0';
    this.choicesContainer.style.opacity = '0';
    this.versionContainer.style.opacity = '0';

    const headingAt = this.createCount > 1 ? 0 : 1500; // Title scene fanfare, first note.
    const starfieldAt = this.createCount > 1 ? 0 : 4000; // Title scene fanfare, second note.
    const planetAt = this.createCount > 1 ? 0 : 5000; // Title scene fanfare, third note.
    const choicesAt = this.createCount > 1 ? 0 : 8750; // Title scene fanfare, fourth note.

    const timeline = this.add.timeline([
      // Show heading.
      {
        at: headingAt,
        run: () => ((this.headingContainer as HTMLElement).style.opacity = '1')
      },
      // Show starfield.
      {
        at: starfieldAt,
        run: () =>
          (this.starfield = this.add.tileSprite(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.scale.width,
            this.scale.height,
            RequiredAssets.ImagesStarfield
          ))
      },
      // Show planet.
      {
        at: planetAt,
        run: () =>
          (this.planet = this.add
            .image(this.cameras.main.centerX, this.cameras.main.centerY, RequiredAssets.ImagesPlanet)
            .setScale(0.5))
      },
      // Show choices.
      {
        at: choicesAt,
        run: () => {
          (this.choicesContainer as HTMLElement).style.opacity = '1';

          (this.versionContainer as HTMLElement).innerText = VERSION;
          (this.versionContainer as HTMLElement).style.opacity = '1';

          this.input.keyboard?.once(Phaser.Input.Keyboard.Events.KEY_UP + 'ONE', () =>
            this.events.emit(TitleScene.Events.CHOICE, TitleScene.Choices.START)
          );
          this.input.keyboard?.once(Phaser.Input.Keyboard.Events.KEY_UP + 'TWO', () =>
            this.events.emit(TitleScene.Events.CHOICE, TitleScene.Choices.CREDITS)
          );
          this.input.keyboard?.once(Phaser.Input.Keyboard.Events.KEY_UP + 'THREE', () =>
            this.events.emit(TitleScene.Events.CHOICE, TitleScene.Choices.EXIT)
          );
        }
      }
    ]);

    timeline.play();
  }

  update() {
    if (!this.starfield) {
      return;
    }

    this.starfield.tilePositionX = Math.sin(this.starfieldAccumulator);

    this.starfieldAccumulator += 0.01;
  }
}
