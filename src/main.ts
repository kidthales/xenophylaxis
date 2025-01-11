import '@phaser';
import '@styles';

import scene from './scenes/world.class';

const width = 640;
const height = 360;

const snapWidth = 320;
const snapHeight = 180;

window.Game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'gameContainer',
  dom: {
    createContainer: true
  },
  transparent: true,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width,
    height,
    min: {
      width,
      height
    },
    snap: {
      width: snapWidth,
      height: snapHeight
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: DEBUG,
      gravity: { x: 0, y: 0 }
    }
  },
  scene
});
