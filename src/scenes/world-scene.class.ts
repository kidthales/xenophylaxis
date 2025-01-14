import { getCurrentWindow } from '@tauri-apps/api/window';
import { PackFile, RequiredAssets } from '../bridge/assets';
import Preloader from '../dom/preloader.class';
import addFromCachedPack from '../loader/add-from-cached-pack.function';

import TitleScene from './title-scene.class';
import DemoNarrativeScene from './demo-narrative-scene.class';

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
        const titleScene = this.scene.get('title');

        titleScene.events.on('titlescenechoice', (choice: number) => {
          switch (choice) {
            case 1:
              const demoNarrativeScene = this.scene.get('demo-narrative');

              demoNarrativeScene.events.once(DemoNarrativeScene.Events.DONE, () => {
                this.scene.stop(demoNarrativeScene);
                this.scene.wake(titleScene);
              });

              this.scene.launch(demoNarrativeScene);
              this.scene.sleep(titleScene);

              break;
            case 2:
              getCurrentWindow().close();
              break;
          }
        });

        this.scene.launch(titleScene);
      },
      [],
      this
    );
  }
}
