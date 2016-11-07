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
  domain: environment.isProduction ? 'https://frontend-bookmark.herokuapp.com' : 'http://localhost:3000',
  mongoDB: process.env.MONGO_DB || 'mongodb://localhost:27017/codeadvisor',
  fbSDK: environment.isProduction ? '/fb-sdk.js' : '/fb-sdk.dev.js',
  app: {
    title: 'Front-end Bookmark',
    description: 'The richest bookmark of front-end resources',
    head: {
      titleTemplate: 'Front-end Bookmark: %s',
      meta: [
        {name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1'},
        {name: 'description', content: 'The richest bookmark of front-end resources'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'The richest bookmark of front-end resources'},
        {property: 'og:image', content: 'https://frontend-advisor.herokuapp.com/logo.jpg'},
        {property: 'og:locale', content: 'fi_FI'},
        {property: 'og:title', content: 'Front-end Bookmark'},
        {property: 'og:description', content: 'The richest bookmark of front-end resources'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@chuson1996'},
        {property: 'og:creator', content: '@chuson1996'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
