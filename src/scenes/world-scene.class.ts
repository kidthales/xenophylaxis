import { getCurrentWindow } from '@tauri-apps/api/window';

import { PackFile, RequiredAssets } from '../bridge/assets';
import Preloader from '../dom/preloader.class';
import addFromCachedPack from '../loader/add-from-cached-pack.function';

import TitleScene from './title-scene.class';
import DemoNarrativeAScene from './demo-narrative-a-scene.class';
import DemoNarrativeBScene from './demo-narrative-b-scene.class';
import CreditsScene from './credits-scene';

const titleSceneKey = 'title';
const demoNarrativeASceneKey = 'demo-narrative-a';
const demoNarrativeBSceneKey = 'demo-narrative-b';
const creditsSceneKey = 'credits-scene';

const domPreloaderFadeOutDuration = 2000;
const domPreloaderFadeOutDelay = 3000;

export default class extends Phaser.Scene {
  private readonly domPreloader = new Preloader();

  init() {
    this.scene.add(titleSceneKey, TitleScene);
    this.scene.add(demoNarrativeASceneKey, DemoNarrativeAScene);
    this.scene.add(demoNarrativeBSceneKey, DemoNarrativeBScene);
    this.scene.add(creditsSceneKey, CreditsScene);
  }

  preload() {
    this.domPreloader.run(this, domPreloaderFadeOutDuration, domPreloaderFadeOutDelay);
    this.load
      .json(PackFile.Key, PackFile.Url)
      .once(Phaser.Loader.Events.FILE_COMPLETE, (key: string) => addFromCachedPack(this, key, RequiredAssets.PackKey));
  }

  create() {
    this.time.delayedCall(
      domPreloaderFadeOutDuration + domPreloaderFadeOutDelay,
      function (this: Phaser.Scene) {
        const titleScene = this.scene.get(titleSceneKey);

        titleScene.events.on(TitleScene.Events.CHOICE, (choice: number) => {
          switch (choice) {
            case TitleScene.Choices.START:
              const demoNarrativeAScene = this.scene.get(demoNarrativeASceneKey);

              demoNarrativeAScene.events.once(DemoNarrativeAScene.Events.DONE, () => {
                this.scene.stop(demoNarrativeAScene);

                const demoNarrativeBScene = this.scene.get(demoNarrativeBSceneKey);

                demoNarrativeBScene.events.once(DemoNarrativeBScene.Events.CHOICE, (choice: number) => {
                  switch (choice) {
                    case DemoNarrativeBScene.Choices.START:
                    // TODO
                    case DemoNarrativeBScene.Choices.EXIT:
                      this.scene.stop(demoNarrativeBScene);
                      this.scene.wake(titleScene);
                      break;
                  }
                });

                this.scene.launch(demoNarrativeBScene);
              });

              this.scene.launch(demoNarrativeAScene);
              this.scene.sleep(titleScene);

              break;

            case TitleScene.Choices.CREDITS:
              const creditsScene = this.scene.get(creditsSceneKey);

              creditsScene.events.once(CreditsScene.Events.DONE, () => {
                this.scene.stop(creditsScene);
                this.scene.wake(titleScene);
              });

              this.scene.launch(creditsScene);
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
