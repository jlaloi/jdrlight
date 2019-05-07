import Vue from 'vue';
import Vuex from 'vuex';

import HTTP from './http';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    lights: [],
    musics: []
  },
  mutations: {
    setLights(state, payload) {
      state.lights = payload.lights;
    },
    setMusics(state, payload) {
      state.musics = payload.musics;
    }
  },
  actions: {
    async fetchLights(context) {
      const lights = (await HTTP.get('/light')).body;
      context.commit('setLights', {
        lights
      });
    },
    async fetchMusics(context) {
      const musics = (await HTTP.get('/musics')).body;
      context.commit('setMusics', {
        musics
      });
    }
  }
});
