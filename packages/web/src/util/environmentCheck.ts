export const isBrowser = () => {
  // Check if the environment is Node.js
  if (typeof process === 'object' && typeof require === 'function') {
    if (process.argv && process.argv.length > 0) {
      const hasNode = process.argv.filter((arg) => arg.includes('node'));
      if (hasNode.length > 0) return false;
    }
  }

  // Check if the environment is a
  // Service worker
  if (typeof importScripts === 'function') {
    // eslint-disable-next-line no-console
    console.log('yolo5');
    return false;
  }

  // Check if the environment is a Browser
  if (typeof window === 'object') {
    return true;
  }

  return false; // catch all
};
