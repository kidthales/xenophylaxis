import { getCurrentWindow } from '@tauri-apps/api/window';

import { PackFile, RequiredAssets } from '../bridge/assets';
import Preloader from '../dom/preloader.class';
import addFromCachedPack from '../loader/add-from-cached-pack.function';

import TitleScene from './title-scene.class';
import DemoNarrativeAScene from './demo-narrative-a-scene.class';

const titleSceneKey = 'title';
const demoNarrativeASceneKey = 'demo-narrative-a';

const domPreloaderFadeOutDuration = 2000;
const domPreloaderFadeOutDelay = 3000;

export default class extends Phaser.Scene {
  /**
   *
   * @private
   */
  private readonly domPreloader = new Preloader();

  /**
   *
   */
  init() {
    this.scene.add(titleSceneKey, TitleScene);
    this.scene.add(demoNarrativeASceneKey, DemoNarrativeAScene);
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
        const titleScene = this.scene.get(titleSceneKey);

        titleScene.events.on(TitleScene.Events.CHOICE, (choice: number) => {
          switch (choice) {
            case TitleScene.Choices.START:
              const demoNarrativeScene = this.scene.get(demoNarrativeASceneKey);

              demoNarrativeScene.events.once(DemoNarrativeAScene.Events.DONE, () => {
                this.scene.stop(demoNarrativeScene);
                this.scene.wake(titleScene);
              });

              this.scene.launch(demoNarrativeScene);
              this.scene.sleep(titleScene);

              break;
            case TitleScene.Choices.EXIT:
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
