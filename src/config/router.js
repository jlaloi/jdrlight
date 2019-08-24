import Vue from 'vue';
import VueRouter from 'vue-router';
import Scenarios from '../component/scenarios';
import Scenario from '../component/scenario';
import Dashboard from '../component/dashboard';

Vue.use(VueRouter);

export const routes = [
  {title: 'Dashboard', path: '/', component: Dashboard},
  {title: 'Scenario', path: '/scenario', component: Scenarios},
  {
    title: 'Scenario',
    path: '/scenario/:id',
    name: 'scenario',
    component: Scenario,
  },
];

export const router = new VueRouter({
  routes,
});

export const serverUrl =
  location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/';
