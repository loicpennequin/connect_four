import React, { useState, createContext } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import themes from '@styles';
import { constants } from '@c4/shared';

export const ThemeContext = createContext(null);

export default function ThemeProvider({ children }) {
    const [currentTheme, setCurrentTheme] = useState(themes[constants.THEMES.DEFAULT]);
    const setTheme = themeKey => setCurrentTheme(themes[themeKey]);

    return (
        <ThemeContext.Provider value={{currentTheme, setTheme, themes: constants.THEMES}}>
            <StyledThemeProvider theme={currentTheme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
}
