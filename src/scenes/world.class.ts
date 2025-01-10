import { PackFile, RequiredAssets } from '../bridge/assets';
import Preloader from '../dom/preloader.class';
import addFromCachedPack from '../loader/add-from-cached-pack.function';

export default class extends Phaser.Scene {
  /**
   *
   * @private
   */
  private readonly domPreloader = new Preloader();

  /**
   *
   */
  preload() {
    this.domPreloader.run(this);
    this.load
      .json(PackFile.Key, PackFile.Url)
      .once(Phaser.Loader.Events.FILE_COMPLETE, (key: string) => addFromCachedPack(this, key, RequiredAssets.PackKey));
  }

  /**
   *
   */
  create() {
    console.log('todo');
  }
}
