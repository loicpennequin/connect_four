import { useTheme } from 'styled-components';
import { useEffect, useState } from 'react';

export function useResponsive() {
  const [state, setState] = useState({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false,
    upToTablet: false,
    upToLaptop: false
  });

  const theme = useTheme();

  useEffect(() => {
    function checkCurrentDevice() {
      const newState = {};
      newState.isDesktop = window.matchMedia(
        `screen and (min-width: ${theme.layout.breakpoints.desktop.min})`
      ).matches;
      newState.isLaptop = window.matchMedia(
        `screen and (min-width: ${theme.layout.breakpoints.laptop.min})`
      ).matches;
      newState.isTablet = window.matchMedia(
        `screen and (min-width: ${theme.layout.breakpoints.tablet.min})`
      ).matches;
      newState.isMobile =
        !newState.isTablet && !newState.isLaptop && !newState.isDesktop;

      newState.upToTablet = window.matchMedia(
        `screen and (max-width: ${theme.layout.breakpoints.tablet.max})`
      ).matches;
      newState.upToLaptop = window.matchMedia(
        `screen and (max-width: ${theme.layout.breakpoints.laptop.max})`
      ).matches;

      setState(newState);
    }

    window.addEventListener('resize', checkCurrentDevice);
    checkCurrentDevice();

    return () => {
      window.removeEventListener('resize', checkCurrentDevice);
    };

  }, [theme]);

  return state;
}
