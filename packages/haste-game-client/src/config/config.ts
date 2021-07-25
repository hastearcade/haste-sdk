import { BootScene } from '../scenes/bootScene';
import { GameScene } from '../scenes/gameScene';
import { LevelSelectionScene } from '../scenes/levelSelection';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: 'Haste Sample',
  backgroundColor: '#125555',
  width: 800,
  height: 600,
  url: 'https://github.com/playhaste/haste-sdk/tree/main/packages/haste-game-client',
  version: '0.0.0',
  scene: [BootScene, GameScene, LevelSelectionScene],
  render: { pixelArt: false, antialias: true },
};
