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

enum State {
  Start,
  ShowTitleScene,
  ShowDemoNarrativeAScene,
  ShowDemoNarrativeBScene,
  ShowCreditsScene
}

export default class extends Phaser.Scene {
  private readonly domPreloader = new Preloader();

  private state!: State;

  private titleScene?: Phaser.Scene;
  private demoNarrativeAScene?: Phaser.Scene;
  private demoNarrativeBScene?: Phaser.Scene;
  private creditsScene?: Phaser.Scene;

  init() {
    this.state = State.Start;

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
    this.time.delayedCall(domPreloaderFadeOutDuration + domPreloaderFadeOutDelay, () => {
      this.state = State.ShowTitleScene;

      const fanfare = this.sound.add(RequiredAssets.TitleSceneFanFare);
      fanfare.once(Phaser.Sound.Events.COMPLETE, () => fanfare.destroy());
      fanfare.play();
    });
  }

  update() {
    switch (this.state) {
      case State.ShowTitleScene:
        this.showTitleScene();
        break;
      case State.ShowDemoNarrativeAScene:
        this.showDemoNarrativeAScene();
        break;
      case State.ShowDemoNarrativeBScene:
        this.showDemoNarrativeBScene();
        break;
      case State.ShowCreditsScene:
        this.showCreditsScene();
        break;
    }
  }

  private showTitleScene() {
    if (this.titleScene) {
      return;
    }

    this.titleScene = this.scene.get(titleSceneKey);

    this.titleScene.events.once(TitleScene.Events.CHOICE, (choice: number) => {
      switch (choice) {
        case TitleScene.Choices.START:
          this.state = State.ShowDemoNarrativeAScene;
          break;
        case TitleScene.Choices.CREDITS:
          this.state = State.ShowCreditsScene;
          break;
        case TitleScene.Choices.EXIT:
          getCurrentWindow().close();
          break;
      }

      this.scene.stop(this.titleScene);
      delete this.titleScene;
    });

    this.scene.launch(this.titleScene);
  }

  private showDemoNarrativeAScene() {
    if (this.demoNarrativeAScene) {
      return;
    }

    this.demoNarrativeAScene = this.scene.get(demoNarrativeASceneKey);

    this.demoNarrativeAScene.events.once(DemoNarrativeAScene.Events.DONE, () => {
      this.state = State.ShowDemoNarrativeBScene;

      this.scene.stop(this.demoNarrativeAScene);
      delete this.demoNarrativeAScene;
    });

    this.scene.launch(this.demoNarrativeAScene);
  }

  private showDemoNarrativeBScene() {
    if (this.demoNarrativeBScene) {
      return;
    }

    this.demoNarrativeBScene = this.scene.get(demoNarrativeBSceneKey);

    this.demoNarrativeBScene.events.once(DemoNarrativeBScene.Events.CHOICE, (choice: number) => {
      switch (choice) {
        case DemoNarrativeBScene.Choices.START:
        // TODO
        case DemoNarrativeBScene.Choices.EXIT:
          this.state = State.ShowTitleScene;
          break;
      }

      this.scene.stop(this.demoNarrativeBScene);
      delete this.demoNarrativeBScene;
    });

    this.scene.launch(this.demoNarrativeBScene);
  }

  private showCreditsScene() {
    if (this.creditsScene) {
      return;
    }

    this.creditsScene = this.scene.get(creditsSceneKey);

    this.creditsScene.events.once(CreditsScene.Events.DONE, () => {
      this.state = State.ShowTitleScene;

      this.scene.stop(this.creditsScene);
      delete this.creditsScene;
    });

    this.scene.launch(this.creditsScene);
  }
}
