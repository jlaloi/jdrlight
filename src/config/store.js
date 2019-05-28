import Vue from 'vue';
import Vuex from 'vuex';

import HTTP from './http';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    lights: [],
    musics: [],
    casts: [],
    images: []
  },
  mutations: {
    setLights(state, payload) {
      state.lights = payload.lights;
    },
    setMusics(state, payload) {
      state.musics = payload.musics;
    },
    setCasts(state, payload) {
      state.casts = payload.casts;
    },
    setImages(state, payload) {
      state.images = payload.images;
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
    },
    async fetchCasts(context) {
      const casts = (await HTTP.get('/cast')).body;
      context.commit('setCasts', {
        casts
      });
    },
    async fetchImages(context) {
      const images = (await HTTP.get('/images')).body;
      context.commit('setImages', {
        images
      });
    }
  }
});
