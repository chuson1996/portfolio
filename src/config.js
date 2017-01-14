require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || '0.0.0.0',
  apiPort: process.env.APIPORT,
  app: {
    title: 'Son Portfolio',
    description: 'Chu Hoang Son - Front-end Developer',
    head: {
      titleTemplate: 'FroDev: %s',
      meta: [
        {name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1'},
        {name: 'description', content: 'Chu Hoang Son - Front-end Developer'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'Chu Hoang Son - Front-end Developer'},
        {property: 'og:image', content: 'https://frodev.herokuapp.com/logo.jpg'},
        {property: 'og:locale', content: 'fi_FI'},
        {property: 'og:title', content: 'Son Portfolio'},
        {property: 'og:description', content: 'Chu Hoang Son - Front-end Developer'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@chuson1996'},
        {property: 'og:creator', content: '@chuson1996'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
