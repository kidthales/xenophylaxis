import { RequiredAssets } from '../bridge/assets';

export default class extends Phaser.Scene {
  create() {
    const htmlTitleScene = this.add.dom(320, 180).createFromCache(RequiredAssets.HtmlTitleScene);
    console.log(htmlTitleScene);
  }
}
