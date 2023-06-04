import { sizes } from './sizes';

const { mobile, tablet, tabletXl, desktop, desktopXl, desktop2Xl } = sizes;

const theme = {
    colors: {
        backgroundGray: '#DEDEDE',
        error: '#F31260',
        success: '#17C964',
        warning: '#F5A524'
    },
    space: {},
    sizes: {
        mobile: `${mobile}px`,
        tablet: `${tablet}px`,
        'tablet-xl': `${tabletXl}px`,
        desktop: `${desktop}px`,
        'desktop-xl': `${desktopXl}px`,
        'desktop-2xl': `${desktop2Xl}px`,
    },
    fonts: {
        primary: 'Nunito Sans, apple-system, sans-serif',
    },
};
export default theme;
