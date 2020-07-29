export const getCookies = () => Object.fromEntries(
    document.cookie.split(';')
      .map(cookie => cookie.replace(' ', '').split('='))
  )