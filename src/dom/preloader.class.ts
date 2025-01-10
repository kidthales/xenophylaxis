/**
 * Provides access to the preloader HTML located in [src/templates/index.html](../templates/index.html).
 */
export default class {
  /**
   * Get the root HTML element.
   * @throws TypeError
   */
  get element() {
    const element = document.getElementById('preloader');

    if (!(element instanceof HTMLDivElement)) {
      throw new TypeError('dom/Preloader root element must be an HTMLDivElement');
    }

    return element;
  }

  /**
   * Get the graphic HTML element.
   * @throws TypeError
   */
  get graphic() {
    const graphic = this.element.querySelector('.preloader-graphic');

    if (!(graphic instanceof HTMLDivElement)) {
      throw new TypeError('dom/Preloader graphic element must be an HTMLDivElement');
    }

    return graphic;
  }

  /**
   * Get the progress HTML element.
   * @throws TypeError
   */
  get progress() {
    const progress = this.element.querySelector('.preloader-progress');

    if (!(progress instanceof HTMLProgressElement)) {
      throw new TypeError('dom/Preloader progress element must be an HTMLProgressElement');
    }

    return progress;
  }

  /**
   * Get the text HTML element.
   * @throws TypeError
   */
  get text() {
    const text = this.element.querySelector('.preloader-text');

    if (!(text instanceof HTMLSpanElement)) {
      throw new TypeError('dom/Preloader text element must be an HTMLSpanElement');
    }

    return text;
  }

  /**
   * Show the preloader and fade out when loader progress is complete.
   * @param scene Provides access to {@link Phaser.Loader.LoaderPlugin}.
   * @param fadeOutDuration Fade out duration in milliseconds.
   */
  run<T extends Phaser.Scene>(scene: T, fadeOutDuration: number = 1000) {
    this.element.style.display = 'flex';
    this.element.style.opacity = '1';

    const progress = this.progress;
    progress.value = 0;
    progress.max = 100;

    const listener = (progress: number) => this.onLoaderProgress(scene, progress, fadeOutDuration, listener);
    scene.load.on(Phaser.Loader.Events.PROGRESS, listener);
  }

  /**
   * Loader plugin progress event handler.
   * @param scene
   * @param progress
   * @param fadeOutDuration
   * @param listener
   * @private
   */
  private onLoaderProgress(
    scene: Phaser.Scene,
    progress: number,
    fadeOutDuration: number,
    listener: (progress: number) => void
  ) {
    this.progress.value = Math.floor(progress * 100);

    if (progress === 1) {
      this.fadeOut(scene, fadeOutDuration, listener);
    }
  }

  /**
   * Fade out the preloader & hide from DOM when complete.
   * @param scene
   * @param duration
   * @param listener
   * @private
   */
  private fadeOut(scene: Phaser.Scene, duration: number, listener: (progress: number) => void) {
    let startTime: number | undefined;

    const fade = (timestamp: number) => {
      if (startTime === undefined) {
        startTime = timestamp;
      }

      const opacity = Phaser.Math.Clamp(1 - (timestamp - startTime) / duration, 0, 1);

      this.element.style.opacity = `${opacity}`;

      if (opacity === 0) {
        this.element.style.display = 'none';
        scene.load.off(Phaser.Loader.Events.PROGRESS, listener);
        return;
      }

      requestAnimationFrame((timestamp) => fade(timestamp));
    };

    requestAnimationFrame((timestamp) => fade(timestamp));
  }
}
