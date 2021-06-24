import { BootScene } from '../scenes/bootScene';
import { GameScene } from '../scenes/gameScene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: 'Haste Sample',
  backgroundColor: '#125555',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  url: 'https://github.com/playhaste/haste-sdk/tree/main/packages/haste-game-client',
  version: '0.0.0',
  scene: [BootScene, GameScene],
  render: { pixelArt: false, antialias: true },
};
