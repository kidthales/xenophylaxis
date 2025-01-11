import { RequiredAssets } from '../bridge/assets';

export default class extends Phaser.Scene {
  create() {
    const htmlTitleScene = this.add
      .dom(this.cameras.main.centerX, this.cameras.main.centerY)
      .createFromCache(RequiredAssets.HtmlTitleScene);

    console.log(htmlTitleScene);
  }
}
