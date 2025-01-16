import { RequiredAssets } from '../bridge/assets';

export default class TitleScene extends Phaser.Scene {
  static readonly Events = {
    CHOICE: 'titlescenechoice'
  } as const;

  static readonly Choices = {
    START: 1,
    EXIT: 2
  } as const;

  create() {
    const sceneHtml = this.add
      .dom(this.cameras.main.centerX, this.cameras.main.centerY)
      .createFromCache(RequiredAssets.TitleSceneHtml);

    const title = sceneHtml.node.querySelector('h1') as HTMLHeadingElement;
    const definitions = sceneHtml.node.querySelectorAll('.definition') as NodeListOf<HTMLDivElement>;
    const menuContainer = sceneHtml.node.querySelector('.menu-container') as HTMLDivElement;

    // Hide the elements.
    title.style.opacity = '0';
    definitions.forEach((d) => (d.style.opacity = '0'));
    menuContainer.style.opacity = '0';

    const timeline = this.add.timeline([
      // Show title.
      {
        at: 1500,
        run: () => (title.style.opacity = '1')
      },
      // Show definitions.
      {
        at: 3000,
        tween: {
          targets: definitions.item(0).style,
          opacity: 1,
          duration: 1500
        }
      },
      {
        at: 5000,
        tween: {
          targets: definitions.item(1).style,
          opacity: 1,
          duration: 1500
        }
      },
      // Show menu.
      {
        at: 8000,
        run: () => {
          menuContainer.style.opacity = '1';

          this.input.keyboard?.on(Phaser.Input.Keyboard.Events.KEY_UP + 'ONE', () =>
            this.events.emit(TitleScene.Events.CHOICE, TitleScene.Choices.START)
          );
          this.input.keyboard?.on(Phaser.Input.Keyboard.Events.KEY_UP + 'TWO', () =>
            this.events.emit(TitleScene.Events.CHOICE, TitleScene.Choices.EXIT)
          );
        }
      }
    ]);

    timeline.play();
  }
}
