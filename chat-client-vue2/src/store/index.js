import Vue from 'vue'
import Vuex from 'vuex'
import {getCurrentUser} from "@/services/user.service";


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName : null,
    userId : null
  },
  getters: {
  },
  mutations: {
    setUserName(state, userName){
      state.userName = userName;
    },
    setUserId(state, userId){
      state.userId = userId;
    }
  },
  actions: {
    async setProfile({commit}){
      const user = await getCurrentUser();
      //console.log('user:', user);
      commit('setUserName', user.displayName);
      commit('setUserId', user._id);
    },
    async loginUserGoogle() {
      window.location.href = "http://localhost:3000/auth/google";
    },
    async loginUserDiscord() {
      window.location.href = "http://localhost:3000/auth/discord";
    },
    async logoutUser() {
      window.location.href = "http://localhost:3000/auth/logout";
    },
  },
  modules: {
  },
  created() {

  }
})
