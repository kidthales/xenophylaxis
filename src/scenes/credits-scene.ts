import { RequiredAssets } from '../bridge/assets';

export default class CreditsScene extends Phaser.Scene {
  static readonly Events = {
    DONE: 'creditsscenedone'
  } as const;

  private sceneHtml?: Phaser.GameObjects.DOMElement;

  init() {
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.sceneHtml?.destroy();
      delete this.sceneHtml;
    });
  }

  create() {
    this.sceneHtml = this.add
      .dom(this.cameras.main.centerX, this.cameras.main.centerY)
      .createFromCache(RequiredAssets.CreditsSceneHtml);

    this.input.keyboard?.once('keyup', () => this.events.emit(CreditsScene.Events.DONE));
  }
}
