import { Theme } from '@mui/material/styles'

function combineStyles(...styles: [Theme, {}]) {
    return function CombineStyles(theme: Theme) {
        const outStyles = styles.map((arg) => {
            // Apply the "theme" object for style functions.
            if (typeof arg === 'function') {
                return arg(theme);
            }
            // Objects need no change.
            return arg;
        });

        return outStyles.reduce((acc, val) => Object.assign(acc, val));
    };
}

export default combineStyles;