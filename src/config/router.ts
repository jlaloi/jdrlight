import Vue from 'vue'
import VueRouter from 'vue-router'
import Scenarios from '../component/scenarios.vue'
import Scenario from '../component/scenario.vue'
import Dashboard from '../component/dashboard.vue'
import TextToSpeech from '../component/textToSpeech'

Vue.use(VueRouter)

export const routes = [
  {title: 'Dashboard', path: '/', component: Dashboard},
  {title: 'Scenario', path: '/scenario', component: Scenarios},
  {
    title: 'Scenario',
    path: '/scenario/:id',
    name: 'scenario',
    component: Scenario,
  },
  {title: 'Say!', path: '/texttospeech', component: TextToSpeech},
]

export const router = new VueRouter({
  routes,
})

export const serverUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/'
