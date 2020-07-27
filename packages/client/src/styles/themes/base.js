import { lighten, darken, transparentize, readableColor } from 'polished';
import { spacing, typography, colors, layout } from '../variables';

function colorVariations(prefix, baseColor) {
    return {
        [prefix]: baseColor,
        [`${prefix}Invert`]: readableColor(
            baseColor,
            colors.black,
            colors.white
        ),
        [`${prefix}Light`]: lighten(0.2, baseColor),
        [`${prefix}Lighter`]: lighten(0.4, baseColor),
        [`${prefix}Dark`]: darken(0.2, baseColor),
        [`${prefix}Darker`]: darken(0.4, baseColor),
        [`${prefix}Half`]: transparentize(0.7, baseColor)
    };
}

export default function mergeTheme(theme) {
    const successColor = theme.color.success || colors.green;
    const warningColor = theme.color.success || colors.orange;
    const dangerColor = theme.color.success || colors.red;
    const linkColor = theme.color.link || theme.color.brand;
    const separatorColor = theme.color.separator || colors.lightGrey;

    return {
        spacing,
        layout,
        font: typography,
        color: {
            ...colors,
            ...colorVariations('success', successColor),
            ...colorVariations('warning', warningColor),
            ...colorVariations('danger', dangerColor),
            ...colorVariations('brand', theme.color.brand),
            ...colorVariations('accent', theme.color.accent),

            link: linkColor,
            linkHovered: darken(0.2, linkColor),

            separator: separatorColor,

            surfaceHovered: darken(0.05, theme.color.surface),

            ...theme.color
        }
    };
}
