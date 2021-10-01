import { BootScene } from '../scenes/bootScene';
import { GameScene } from '../scenes/gameScene';
import { LevelSelectionScene } from '../scenes/levelSelection';
import { ResultsScene } from '../scenes/resultsScene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: 'Haste Sample',
  backgroundColor: '#ADD8E6',
  width: 800,
  height: 600,
  url: 'https://github.com/playhaste/haste-sdk/tree/main/packages/haste-game-client',
  version: '0.0.0',
  scene: [BootScene, GameScene, LevelSelectionScene, ResultsScene],
  render: { pixelArt: false, antialias: true },
};
