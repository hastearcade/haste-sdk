const colorNames = ['primary', 'secondary', 'tertiary', 'success', 'failure', 'info'] as const;
type ColorName = typeof colorNames[number];

/**
 * Gets a hex value based on a color name passed in
 * @param {ColorName} colorName The color name that you want the hex value for
 * @returns {string} hex value based on color name passed in
 */
export const getColorValue = (colorName: ColorName) => {
  switch (colorName) {
    case 'primary':
      return '#8366F4';
    case 'secondary':
      return '#FAAF3A';
    case 'tertiary':
      return '#4CCB87';
    case 'success':
      return '#4CCB87';
    case 'failure':
      return '#EA486F';
    case 'info':
      return '#62D0F9';
    default:
      // eslint-disable-next-line no-case-declarations
      const _exhaustiveCheck: never = colorName;
      return _exhaustiveCheck;
  }
};
