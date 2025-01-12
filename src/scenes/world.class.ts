import { PackFile, RequiredAssets } from '../bridge/assets';
import Preloader from '../dom/preloader.class';
import addFromCachedPack from '../loader/add-from-cached-pack.function';

import TitleScene from './title.class';
import DemoNarrativeScene from './demo-narrative.class';

const domPreloaderFadeOutDuration = 2000;
const domPreloaderFadeOutDelay = 3000;

export default class extends Phaser.Scene {
  /**
   *
   * @private
   */
  private readonly domPreloader = new Preloader();

  init() {
    this.scene.add('title', TitleScene);
    this.scene.add('demo-narrative', DemoNarrativeScene);
  }

  /**
   *
   */
  preload() {
    this.domPreloader.run(this, domPreloaderFadeOutDuration, domPreloaderFadeOutDelay);
    this.load
      .json(PackFile.Key, PackFile.Url)
      .once(Phaser.Loader.Events.FILE_COMPLETE, (key: string) => addFromCachedPack(this, key, RequiredAssets.PackKey));
  }

  /**
   *
   */
  create() {
    this.time.delayedCall(
      domPreloaderFadeOutDuration + domPreloaderFadeOutDelay,
      function (this: Phaser.Scene) {
        //this.scene.launch('title');
        this.scene.launch('demo-narrative');
      },
      [],
      this
    );
  }
}
