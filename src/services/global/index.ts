import { defineStore } from 'pinia';
import { RGlobal } from './reducer';
import { initialStateGlobal, type StateGlobal } from './state';

export const SGlobal = defineStore('SGlobal', {
  state: (): StateGlobal => initialStateGlobal,
  actions: {
    set(value: StateGlobal) {
      Object.keys(value).forEach(key => {
        this[key] = value[key as keyof StateGlobal];
      });
    },
    postLogin(value: { password: string; email: string }) {
      RGlobal.postLogin.reducer(this, value);
    },
  },
});
