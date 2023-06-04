import { createStitches } from '@stitches/react';
import theme from 'styles/theme';

export const {
  styled,
  css,
  theme: createTheme,
  keyframes,
  globalCss: globalStyles,
  getCssText,
} = createStitches({
  theme,
  media: {
    mobile: `(min-width: ${theme.sizes.mobile})`,
    tablet: `(min-width: ${theme.sizes.tablet})`,
    'tablet-xl': `(min-width: ${theme.sizes['tablet-xl']})`,
    desktop: `(min-width: ${theme.sizes.desktop})`,
    'desktop-xl': `(min-width: ${theme.sizes.desktop})`,
    'desktop-2xl': `(min-width: ${theme.sizes['desktop-2xl']})`,
  },
});
