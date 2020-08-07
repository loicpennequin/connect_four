import mergeTheme from './base';
import { colors } from '../variables';

export default mergeTheme({
    color: {
        brand: colors.darkGrey,
        accent: colors.blue,
        text: colors.black,
        background: colors.ultraLightGrey,
        surface: colors.white
    }
});
