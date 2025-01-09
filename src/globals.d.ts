export {};

declare global {
  const DEBUG: boolean;
  const VERSION: string;

  interface Window {
    Game: Phaser.Game;
  }
}
