/**
 * Create new DOMRect that is normalized to the scale manager's current display scale.
 * @param scene Provides access to {@link Phaser.Scale.ScaleManager} service.
 * @param rect Source DOMRect.
 * @returns Normalized DOMRect.
 */
export default function <T extends Phaser.Scene>(scene: T, rect: DOMRect) {
  return new DOMRect(
    rect.x * scene.scale.displayScale.x,
    rect.y * scene.scale.displayScale.y,
    rect.width * scene.scale.displayScale.x,
    rect.height * scene.scale.displayScale.y
  );
}
