import { RequiredAssets } from '../bridge/assets';

export default class extends Phaser.Scene {
  create() {
    const sceneHtml = this.add
      .dom(this.cameras.main.centerX, this.cameras.main.centerY)
      .createFromCache(RequiredAssets.DemoNarrativeSceneHtml);

    this.anims.createFromAseprite(RequiredAssets.StellarNeighborhoodAseprite);

    const map = this.add
      .sprite(320, 0, RequiredAssets.StellarNeighborhoodAseprite)
      .setOrigin(0)
      .play({ key: 'stellar-neighborhood Start', repeat: -1 });

    console.log(sceneHtml);
    console.log(map);
  }
}
