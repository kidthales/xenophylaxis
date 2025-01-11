/**
 * Takes a key for a fully parsed pack file object and adds the entries from the part of the pack specified into the
 * load queue.
 * @param scene Provides access to {@link Phaser.Loader.LoaderPlugin} & {@link Phaser.Cache.CacheManager} services.
 * @param pack Cache key for the pack file object.
 * @param packKey Pack file entries key.
 * @returns Result of the {@link Phaser.Loader.LoaderPlugin.addPack} call.
 */
export default function <T extends Phaser.Scene>(scene: T, pack: string, packKey: string) {
  return scene.load.addPack(scene.cache.json.get(pack), packKey);
}
