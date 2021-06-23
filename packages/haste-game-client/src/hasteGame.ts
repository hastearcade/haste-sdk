import { Engine, DisplayMode, Loader, Logger, LogLevel } from 'excalibur';
import { Logout } from './actors/logout';
import { InitScene } from './scenes/initScene';
import { Resources } from './resources';

export class HasteGame extends Engine {
  private logout: Logout;
  private initScene: InitScene;

  constructor() {
    Logger.getInstance().defaultLevel = LogLevel.Info;
    super({ displayMode: DisplayMode.FullScreen });
  }

  public start() {
    // Create new scene with a player
    this.initScene = new InitScene(this);
    this.logout = new Logout();
    this.initScene.add(this.logout);
    this.add('initScene', this.initScene);

    const loader = new Loader(Object.values(Resources));
    return super.start(loader);
  }
}
