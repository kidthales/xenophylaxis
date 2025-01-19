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

    const headingContainer = sceneHtml.node.querySelector('#headingContainer') as HTMLElement;
    const choicesContainer = sceneHtml.node.querySelector('#choicesContainer') as HTMLElement;

    // Hide the elements.
    headingContainer.style.opacity = '0';
    choicesContainer.style.opacity = '0';

    const timeline = this.add.timeline([
      // Show heading.
      {
        at: 1500,
        run: () => (headingContainer.style.opacity = '1')
      },
      // Show choices.
      {
        at: 3000,
        run: () => {
          choicesContainer.style.opacity = '1';

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
