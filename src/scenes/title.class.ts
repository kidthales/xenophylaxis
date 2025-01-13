import { RequiredAssets } from '../bridge/assets';

export default class extends Phaser.Scene {
  create() {
    const titleSceneHtml = this.add
      .dom(this.cameras.main.centerX, this.cameras.main.centerY)
      .createFromCache(RequiredAssets.TitleSceneHtml);

    const title = titleSceneHtml.node.querySelector('h1') as HTMLHeadingElement;
    const definitions = titleSceneHtml.node.querySelectorAll('.definition') as NodeListOf<HTMLElement>;
    const menuContainer = titleSceneHtml.node.querySelector('.menu-container') as HTMLElement;

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

          this.input.keyboard?.on('keyup-ONE', () => this.events.emit('titlescenechoice', 1));
          this.input.keyboard?.on('keyup-TWO', () => this.events.emit('titlescenechoice', 2));
        }
      }
    ]);

    timeline.play();
  }
}
