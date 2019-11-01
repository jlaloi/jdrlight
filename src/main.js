import 'babel-polyfill'
import './styles/main.scss'

import Vue from 'vue'

import App from './component/app'
import {store} from './config/store'
import {apolloProvider} from './config/apollo'
import {router} from './config/router'

new Vue({
  store,
  apolloProvider,
  router,
  el: '#app',
  render: h => h(App),
})
