import Vue from 'vue';
import VueRouter from 'vue-router';
import Scenes from '../component/Scenes';
import Dashboard from '../component/Dashboard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Dashboard
  },
  {
    path: '/scenes',
    component: Scenes
  }
];

export const router = new VueRouter({
  routes
});
