import { HasteClient } from '@hastearcade/web';

// This is a way to type a simple
// JavaScript object to pass the haste
// client between scenes to support the
// login and logout buttons
export class GameSceneData {
  hasteClient: HasteClient;
}
