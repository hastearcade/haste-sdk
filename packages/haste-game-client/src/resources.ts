import { Texture } from 'excalibur';
import logout from './images/sword.png';

/**
 * Default global resource dictionary. This gets loaded immediately
 * and holds available assets for the game.
 */
const Resources = {
  Logout: new Texture(logout),
};

export { Resources };
